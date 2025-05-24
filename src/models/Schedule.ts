import { Hour, Minute } from './Time';

export interface Schedule {
  readonly courses: Course[];
  readonly subjects: Subject[];
}

export type Term = 'A' | 'B' | 'C' | 'D' | 'E1' | 'E2';

export type Semester = 'Spring' | 'Fall' | 'Summer';

export type DeliveryMode = 'In-Person' | 'Online' | 'Hybrid';

export type TermPeriod = Term | Semester;

export interface ShallowCourse {
  academicLevel: 'Undergraduate' | 'Graduate';
  credits: number;
  code: string;
  notes: string;
  subject: Subject;
  title: string;
}

export interface Course extends ShallowCourse {
  deliveryMode: DeliveryMode;
  endDate: Date;
  enrollment: Capacity;
  format:
    | 'Discussion'
    | 'Experiential'
    | 'Laboratory'
    | 'Lecture'
    | 'Internship'
    | 'Seminar'
    | 'Workshop';
  locations: string[]; // FKs to Locations?
  patterns: Pattern[]; // meeting patterns
  startDate: Date;
  tags: Record<string, string>; // this might be able to be improved upon
  term: TermPeriod;
  waitlist: Capacity;
}

export interface Capacity {
  remaining: number;
  maximum: number;
  disabled: boolean;
}

export type DayCode = 'M' | 'T' | 'W' | 'R' | 'F';

// Note: We do not inclue the Meridian, Hour is 24-hour.
export interface CourseTime {
  hour: Hour;
  minute: Minute;
}

export interface Pattern {
  days: DayCode[];
  startTime: CourseTime;
  endTime: CourseTime;
  locationId: string; // FK to Location
}

export interface Subject {
  name: string; // full subject name, i.e. Mathematical Sciences
  code: string; // subject shortcode i.e. MA
}
