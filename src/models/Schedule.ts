import { Hour, Minute } from './Time';

export interface Schedule {
  readonly courses: Course[];
  readonly subjects: Subject[];
}

export type Term = 'A' | 'B' | 'C' | 'D' | 'E1' | 'E2';

export type Semester = 'Spring' | 'Fall' | 'Summer';

export type DeliveryMode = 'In-Person' | 'Online' | 'Hybrid';

export interface Course {
  academicLevel: 'Undergraduate' | 'Graduate';
  credits: number;
  code: string;
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
  notes: string;
  patterns: Pattern[]; // meeting patterns
  startDate: Date;
  subject: Subject;
  tags: Record<string, string>; // this might be able to be improved upon
  title: string;
  term: Term | Semester;
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
