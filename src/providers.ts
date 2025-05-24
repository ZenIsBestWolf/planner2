import { createContext, useContext } from 'react';
import { Schedule } from './models/Schedule';

interface ScheduleContextProps {
  readonly schedule: Schedule;
  readonly refreshSchedule: () => Promise<void>;
}

export interface Application {
  readonly selectedCourses: string[];
  readonly name: string;
  readonly showMeridian: boolean;
}

interface ApplicationContextProps {
  readonly application: Application;
  readonly setApplication: (k: keyof Application, v: Application[keyof Application]) => void;
}

export const SchedulerContext = createContext<ScheduleContextProps>({} as never);

export const ApplicationContext = createContext<ApplicationContextProps>({} as never);

export const useSchedule = (): Schedule => {
  const { schedule } = useContext(SchedulerContext);
  return schedule;
};

export const useRefreshSchedule = () => {
  const { refreshSchedule } = useContext(SchedulerContext);
  return refreshSchedule;
};

export const useApp = () => {
  const { application } = useContext(ApplicationContext);
  return application;
};

export const useUpdateApp = () => {
  const { setApplication } = useContext(ApplicationContext);
  return setApplication;
};
