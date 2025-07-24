import { Course, CourseSection, Schedule, Subject, TermPeriod } from './models/Schedule';
import { RemoteEntry, RemoteResponse } from './models/Workday';

import {
  Capacity,
  CourseTime,
  DayCode,
  DeliveryMode,
  Pattern,
  Semester,
  Term,
} from './models/Schedule';
import { Hour, Minute } from './models/Time';

interface ParserResult {
  academicLevel: 'Undergraduate' | 'Graduate';
  credits: number;
  code: string;
  notes: string;
  subject: Subject;
  title: string;
  format:
    | 'Discussion'
    | 'Experiential'
    | 'Laboratory'
    | 'Lecture'
    | 'Internship'
    | 'Seminar'
    | 'Workshop';
  deliveryMode: DeliveryMode;
  endDate: Date;
  enrollment: Capacity;
  locations: string[]; // FKs to Locations?
  patterns: Pattern[]; // meeting patterns
  startDate: Date;
  tags: Record<string, string>; // this might be able to be improved upon
  term: TermPeriod;
  waitlist: Capacity;
}

interface SectionResponse {
  course: Course;
  section: CourseSection;
}

interface ParsedResponse {
  newSubjects: Subject[];
  sectionResponse: SectionResponse;
}

export class ScheduleError extends Error {
  public constructor(msg?: string) {
    super(msg);
  }
}

class TimeError extends ScheduleError {
  public constructor(msg?: string) {
    super(msg);
  }
}

class RequestError extends Error {
  public override name = 'RequestError';
  public constructor(
    public readonly response: { payload: unknown; headers: Headers; status: number },
  ) {
    super(`Request failed`);
  }
}

export const pullSchedule = async (): Promise<Schedule> => {
  // const data: RemoteResponse = { Report_Entry: [] };
  let data: RemoteResponse;
  // get network data

  // const response = await fetch(`https://courselistings.wpi.edu/assets/prod-data.json`);
  const response = await fetch(`http://localhost:8081/assets/prod-data.json`);

  const body = await response.text();

  try {
    data = JSON.parse(body) as unknown as RemoteResponse;
  } catch {
    console.error(response);
    throw new RequestError({
      payload: body,
      headers: response.headers,
      status: response.status,
    });
  }

  return processData(data);
};

const processData = (data: RemoteResponse): Schedule => {
  let schedule: Schedule = {
    subjects: [],
    courses: [],
  };

  const { Report_Entry: entries } = data;

  const subjectMap = new Map<string, Subject>();

  for (const entry of entries) {
    try {
      const { newSubjects, sectionResponse } = parseEntry(entry, schedule);
      for (const subject of newSubjects) {
        if (!subjectMap.get(subject.code)) {
          subjectMap.set(subject.code, subject);
        }
      }
      const courses = [...schedule.courses];
      const lookup = schedule.courses.find((c) => c === sectionResponse.course);
      if (lookup) {
        const modifiedCourse = {
          ...lookup,
          sections: [...lookup.sections, sectionResponse.section],
        } as Course;
        courses.push(modifiedCourse);
      } else {
        courses.push(sectionResponse.course);
      }

      const translatedSubjects: Subject[] = [];

      for (const value of subjectMap.values()) {
        translatedSubjects.push(value);
      }

      schedule = {
        subjects: translatedSubjects,
        courses: courses,
      };
    } catch (error) {
      if (error instanceof TimeError || error instanceof ScheduleError) {
        console.log(`An error occurred on an entry with title ${entry.Course_Title}`);
        continue;
      }

      throw error;
    }
  }

  return schedule;
};

const parseEntry = (raw: RemoteEntry, currentSchedule: Partial<Schedule>): ParsedResponse => {
  const scheduler: Schedule = {
    subjects: [...(currentSchedule.subjects ?? [])],
    courses: [...(currentSchedule.courses ?? [])],
  };

  /* Parse Academic_level */
  let undergraduate: boolean;
  if (raw.Academic_Level === 'Undergraduate') {
    undergraduate = true;
  } else if (raw.Academic_Level === 'Graduate') {
    undergraduate = false;
  } else {
    throw new ScheduleError('Academic_Level missing from entry.');
  }

  /* Parse Credits */
  const credits = +raw.Credits;
  if (credits.toString() !== raw.Credits)
    throw new ScheduleError(`Invalid credits value ${raw.Credits}`);

  /* Parse Course_Tags */
  const tagParts = raw.Course_Tags.split('; ');
  const tags: Record<string, string> = {};
  for (const part of tagParts) {
    const portions = part.split(' :: ');
    tags[portions[0]] = portions[1];
  }

  /* Parse Delivery_Mode */
  if (
    raw.Delivery_Mode !== 'In-Person' &&
    raw.Delivery_Mode !== 'Online' &&
    raw.Delivery_Mode !== 'Hybrid'
  ) {
    throw new ScheduleError(`Invalid Delivery_Mode passed: ${raw.Delivery_Mode}`);
  }
  const deliveryMode = raw.Delivery_Mode as DeliveryMode;

  /* Parse Enrollment */
  const elParts = raw.Enrolled_Capacity.split('/');
  if (elParts.length !== 2) {
    throw new ScheduleError('Enrolled_Capacity is misbehaving.');
  }
  const elRemaining = +elParts[0];
  const elMaximum = +elParts[1];

  const enrollment: Capacity = {
    remaining: elRemaining,
    maximum: elMaximum,
    disabled: elMaximum === 0 && elRemaining === 0,
  };

  /* Parse Format */
  const rawFormat = raw.Instructional_Format;
  const format = rawFormat as
    | 'Discussion'
    | 'Experiential'
    | 'Laboratory'
    | 'Lecture'
    | 'Internship'
    | 'Seminar'
    | 'Workshop';

  if (rawFormat !== format) {
    throw new ScheduleError(`Invalid format: ${rawFormat}`);
  }

  /* Parse Locations & Patterns */
  const locations: string[] = [];
  const patterns: Pattern[] = [];
  for (const pattern of raw.Section_Details.split('; ')) {
    if (pattern === 'Online-asynchronous |') {
      locations.push('Online-asynchronous');
      break;
    }

    if (pattern === 'Online-synchronous |') {
      locations.push('Online-synchronous');
      break;
    }

    if (pattern === 'Online (inactive) |') {
      locations.push('Online');
      break;
    }

    if (pattern === 'Other |') {
      locations.push('Other');
      break;
    }

    if (pattern === 'Off Campus |') {
      locations.push('Off Campus');
      break;
    }

    if (pattern === '') continue;

    const patternPortions = pattern.split(' | ');
    if (patternPortions.length !== 3) {
      throw new ScheduleError(
        `Patterns are not behaving as expected. Got ${patternPortions.length} when expecting 3 on pattern: ${pattern}`,
      );
    }

    const times = patternPortions[2].split(' - ');

    let startTime: CourseTime;
    let endTime: CourseTime;

    try {
      startTime = convertTime(times[0]);
      endTime = convertTime(times[1]);
    } catch (e: unknown) {
      if (e instanceof TimeError) {
        throw new ScheduleError(`Error in parsing times for ${raw.Course_Title}`);
      }

      throw e as Error;
    }

    const newPattern: Pattern = {
      locationId: patternPortions[0],
      days: patternPortions[1].split('-') as DayCode[],
      startTime,
      endTime,
    };

    locations.push(patternPortions[0]);
    patterns.push(newPattern);
  }
  if (locations.length === 0) locations.push('None');

  /* Parse Dates */
  const startDate = new Date(raw.Course_Section_Start_Date);
  const endDate = new Date(raw.Course_Section_End_Date);

  /* Parse Subject */
  let subject: Subject;
  const subjectCode = raw.Course_Title.substring(0, raw.Course_Title.indexOf(' '));
  const allSubjects = raw.Subject.split('; ');
  const trueSubject = allSubjects[allSubjects.length - 1];
  const subjectLookup = scheduler.subjects.find((s) => s.code === subjectCode);
  if (subjectLookup) {
    // if (subjectLookup.name !== trueSubject) {
    //   const fallbackSubject = raw.Course_Section_Owner;
    //   if (!fallbackSubject.includes(subjectLookup.name))
    //     throw new ScheduleError(
    //       `Subject Code ${subjectCode} returned a lookup for ${subjectLookup.name} but was looking for ${trueSubject} (also tried ${fallbackSubject})`,
    //     );
    // }
    subject = subjectLookup;
  } else {
    subject = {
      code: subjectCode,
      name: trueSubject,
    };
    scheduler.subjects.push(subject);
  }

  /* Parse Title */
  const title = raw.Course_Title.split(' - ')[1];

  /* Parse Code */
  const code = raw.Course_Title.split(' - ')[0].replace(`${subject.code} `, '');

  /* Parse Term */
  const rawTerm = raw.Starting_Academic_Period_Type.replace(' Term', '');
  const term = rawTerm as Term | Semester;
  if (rawTerm !== term) throw new ScheduleError(`Invalid term: ${rawTerm}`);

  /* Parse Waitlist */
  const wlParts = raw.Waitlist_Waitlist_Capacity.split('/');
  if (wlParts.length !== 2) throw new ScheduleError('Waitlist_Waitlist_Capacity is misbehaving.');
  const wlOccuppied = +wlParts[0];
  const wlMaximum = +wlParts[1];

  const waitlist: Capacity = {
    remaining: wlMaximum - wlOccuppied,
    maximum: wlMaximum,
    disabled: wlMaximum === 0 && wlOccuppied === 0,
  };

  /* Object Compilation */
  const entry: ParserResult = {
    academicLevel: undergraduate ? 'Undergraduate' : 'Graduate',
    code,
    credits,
    deliveryMode,
    endDate,
    enrollment,
    format,
    locations,
    notes: raw.Public_Notes,
    patterns,
    startDate,
    subject,
    tags,
    term,
    title,
    waitlist,
  };

  return { newSubjects: scheduler.subjects, sectionResponse: entry };
};

const convertTime = (input: string): CourseTime => {
  const rawHour = Number.parseInt(input.split(':')[0], 10);
  const PM = input.toUpperCase().includes('PM');

  if (rawHour > 23 || rawHour < 0) {
    throw new TimeError('Invalid hour');
  }

  const hour = (rawHour < 12 && PM ? rawHour + 12 : rawHour) as Hour;

  const rawMinute = Number.parseInt(input.split(':')[1].split(' ')[0]);
  if (rawMinute > 59 || rawMinute < 0) {
    throw new TimeError('Invalid minute');
  }

  const minute = rawMinute as Minute;

  return { hour, minute };
};
