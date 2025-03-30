import {
  Capacity,
  Course,
  CourseTime,
  DayCode,
  DeliveryMode,
  Pattern,
  Schedule,
  Semester,
  Subject,
  Term,
} from '../models/Schedule';
import { Hour, Minute } from '../models/Time';
import { RemoteEntry } from '../models/Workday';

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

export function parse(raw: RemoteEntry, scheduler: Schedule): Course {
  /* Parse Academic_level */
  let undergraduate: boolean;
  if (raw.Academic_Level === 'Undergraduate') undergraduate = true;
  else if (raw.Academic_Level === 'Graduate') undergraduate = false;
  else throw new ScheduleError('Academic_Level missing from entry.');

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
  if (elParts.length !== 2) throw new ScheduleError('Enrolled_Capacity is misbehaving.');
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
  if (rawFormat !== format) throw new ScheduleError(`Invalid format: ${rawFormat}`);

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
  const entry: Course = {
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

  return entry;
}

const convertTime = (input: string): CourseTime => {
  let hour: Hour;
  let minute: Minute;

  try {
    const rawHour = Number.parseInt(input.split(':')[0], 10);
    const PM = input.toUpperCase().includes('PM');

    if (rawHour > 23 || rawHour < 0) {
      throw new TimeError('Invalid hour');
    }

    hour = (rawHour < 12 && PM ? rawHour + 12 : rawHour) as Hour;
  } catch {
    console.error('Hour error');
    throw new TimeError('Invalid time');
  }

  try {
    const rawMinute = Number.parseInt(input.split(':')[1].split(' ')[0]);
    if (rawMinute > 59 || rawMinute < 0) {
      throw new TimeError('Invalid minute');
    }

    minute = rawMinute as Minute;
  } catch {
    console.error('Minute error');
    throw new TimeError('Invalid time');
  }

  return { hour, minute };
};
