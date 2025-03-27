import { RemoteResponse } from './models/Workday';
import { Course, Schedule, Subject } from './models/Schedule';

// eslint-disable-next-line @typescript-eslint/require-await
export const pullSchedule = async (): Promise<Schedule> => {
  const data: RemoteResponse = { Report_Entry: [] };
  // get network data

  return processData(data);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const processData = (data: RemoteResponse): Schedule => {
  const courses: Course[] = [];
  const subjects: Subject[] = [];

  // Perform conversion logic

  return { courses, subjects };
};
