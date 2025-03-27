export interface Schedule {
  readonly courses: Course[];
  readonly subjects: Subject[];
  // readonly academicYear: string;
}

type Term = 'A' | 'B' | 'C' | 'D' | 'E1' | 'E2';

type Semester = 'Spring' | 'Fall' | 'Summer';

export interface Course {
  academicLevel: 'Undergraduate' | 'Graduate';
  credits: number;
  deliveryMode: 'In-Person' | 'Online';
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
  term: Term | Semester;
  waitlist: Capacity;
}

interface Capacity {
  remaining: number;
  maximum: number;
  disabled: boolean;
}

type DayCode = 'M' | 'T' | 'W' | 'R' | 'F';

interface Pattern {
  days: DayCode[];
  startTime: string; // TODO: How to store time irrespective of date?
  endTime: string;
  locationId: string; // FK to Location
}

export interface Subject {
  name: string; // full subject name, i.e. Mathematical Sciences
  code: string; // subject shortcode i.e. MA
}
