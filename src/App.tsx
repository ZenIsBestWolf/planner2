import React, { FC, useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { Container, Spinner } from 'reactstrap';
import { pullSchedule } from './API';
import { NavBar } from './components/NavBar';
import { Schedule } from './models/Schedule';
import { CoursesPage } from './pages/CoursesPage';
import { InfoPage } from './pages/InfoPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { TimesPage } from './pages/TimesPage';
import { Application, ApplicationContext, SchedulerContext } from './providers';
import { useObjectState } from './utils';
import { Disclaimer } from './components/Disclaimer';

export const App: FC = () => {
  const [schedule, setSchedule] = useState<Schedule>({} as never);
  const [loading, setLoading] = useState(true);
  const [application, setApplication, rawSetApplication] = useObjectState<Application>({
    selectedCourses: [],
    showMeridian: true,
    navbarCollapsed: false,
    theme: 'light',
    seenDisclaimer: false,
  });

  const refreshSchedule = useCallback(async () => {
    setLoading(true);
    const newSched = await pullSchedule();
    setSchedule(newSched);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshSchedule();

    const existingPreferences = localStorage.getItem('preferences');
    if (existingPreferences) {
      rawSetApplication(JSON.parse(existingPreferences) as Application);
    }
  }, [rawSetApplication, refreshSchedule]);

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(application));
  }, [application]);

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
        <Disclaimer />
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
