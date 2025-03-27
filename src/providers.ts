import { createContext, useContext } from 'react';
import { Schedule } from './models/Schedule';

interface ScheduleContextProps {
  schedule: Schedule;
  refreshSchedule: () => Promise<void>;
}

export const SchedulerContext = createContext<ScheduleContextProps>({} as never);

export const useSchedule = (): Schedule => {
  const { schedule } = useContext(SchedulerContext);
  return schedule;
};

export const useRefreshSchedule = () => {
  const { refreshSchedule } = useContext(SchedulerContext);
  return refreshSchedule;
};
