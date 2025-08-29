import { Hour, Minute } from './Time';
import { RemoteEntry } from './Workday';

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

export const isTerm = (period: TermPeriod): period is Term => terms.includes(period as Term);
export const isSemester = (period: TermPeriod): period is Semester =>
  semesters.includes(period as Semester);

export type TermPeriod = Term | Semester;

export const sectionFormats = [
  'Discussion',
  'Experiential',
  'Laboratory',
  'Lecture',
  'Internship',
  'Seminar',
  'Workshop',
] as const;

export type SectionFormat = (typeof sectionFormats)[number];

export const termStatuses = ['Available', 'Waitlisted', 'Full', 'Disabled', 'Unavailable'] as const;

export type TermStatus = (typeof termStatuses)[number];

export const academicLevels = ['Undergraduate', 'Graduate'] as const;

export type AcademicLevel = (typeof academicLevels)[number];

export interface Course {
  academicLevel: AcademicLevel;
  credits: number;
  code: string;
  notes: string;
  subject: Subject;
  title: string;
  sections: CourseSection[];
  description: string;
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
  instructors: string;
  format: SectionFormat;
  // DEBUG. WILL INCREASE MEMORY USAGE DRASTICALLY. DO NOT LEAVE IN FOR PROD.
  raw?: RemoteEntry;
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
