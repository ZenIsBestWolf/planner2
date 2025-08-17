import React, { FC, useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { Container, Spinner } from 'reactstrap';
import { SchedulerContext, ApplicationContext, Application } from './providers';
import { Schedule } from './models/Schedule';
import { InfoPage } from './pages/InfoPage';
import { NavBar } from './components/NavBar';
import { CoursesPage } from './pages/CoursesPage';
import { TimesPage } from './pages/TimesPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { pullSchedule } from './API';
import { useObjectState } from './utils';

export const App: FC = () => {
  const [schedule, setSchedule] = useState<Schedule>({} as never);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useObjectState<Application>({
    selectedCourses: [],
    name: 'Zen',
    showMeridian: true,
  });

  // TODO: Need a way to save Application data/preferences to local storage

  const refreshSchedule = useCallback(async () => {
    const newSched = await pullSchedule();
    setSchedule(newSched);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshSchedule();
  }, [refreshSchedule]);

  if (loading) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  return (
    <ApplicationContext.Provider value={{ application, setApplication }}>
      <SchedulerContext.Provider value={{ schedule, refreshSchedule }}>
        <a href="#main" className="sr-only">
          Skip to main content
        </a>
        <NavBar />
        <Container tag="main" id="main" fluid>
          <Routes>
            <Route index element={<CoursesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/times" element={<TimesPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
          </Routes>
        </Container>
      </SchedulerContext.Provider>
    </ApplicationContext.Provider>
  );
};
