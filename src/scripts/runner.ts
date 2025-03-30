import * as remote from '../../sample/prod-data.json';
import { Schedule } from '../models/Schedule';
import { RemoteEntry, RemoteResponse } from '../models/Workday';
import { parse, ScheduleError } from './parser';

const scheduleResponseObject = remote as RemoteResponse;
const schedule: Schedule = {
  subjects: [],
  courses: [],
};

const failed: {
  message: string;
  entry: RemoteEntry;
}[] = [];

for (const entry of scheduleResponseObject.Report_Entry) {
  try {
    const course = parse(entry, schedule);
    schedule.courses.push(course);
  } catch (e) {
    if (e instanceof ScheduleError) {
      failed.push({
        entry,
        message: e.message,
      });
    }
  }
}

console.log(
  `Parsing has completed, there are ${schedule.courses.length} successful conversions and ${failed.length} failures.`,
);

const lookupNumber = Math.floor(Math.random() * schedule.courses.length);

console.log(`For fun, here is parsed entry number ${lookupNumber}:`);
console.log(schedule.courses[lookupNumber]);
// console.log(`and the same for failures:`);
// console.log(failed[lookupNumber]);

console.log('all error messages:');
for (const fail of failed) {
  console.log(`${fail.entry.Course_Title} failed with message ${fail.message}`);
}
