import { Hour, Minute } from './Time';

export interface Schedule {
  readonly courses: Course[];
  readonly subjects: Subject[];
}

export const terms = ['A', 'B', 'C', 'D', 'E1', 'E2'] as const;

export type Term = (typeof terms)[number];

export const semesters = ['Spring', 'Fall', 'Summer'] as const;

export type Semester = (typeof semesters)[number];

export const deliveryModes = ['In-Person', 'Online', 'Hybrid'] as const;

export type DeliveryMode = (typeof deliveryModes)[number];

export const termPeriods = [...terms, ...semesters] as const;

export type TermPeriod = Term | Semester;

export const courseFormats = [
  'Discussion',
  'Experiential',
  'Laboratory',
  'Lecture',
  'Internship',
  'Seminar',
  'Workshop',
] as const;

export type CourseFormat = (typeof courseFormats)[number];

export const academicLevels = ['Undergraduate', 'Graduate'] as const;

export type AcademicLevel = (typeof academicLevels)[number];

// TODO: Convert to ShallowCourse
export interface Course {
  academicLevel: AcademicLevel;
  credits: number;
  code: string;
  notes: string;
  subject: Subject;
  title: string;
  sections: CourseSection[];
  format: CourseFormat;
}

export interface CourseSection {
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
