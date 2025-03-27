import React, { FC, useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { Container, Spinner } from 'reactstrap';
import { SchedulerContext } from './providers';
import { Schedule } from './models/Schedule';
import { InfoPage } from './pages/InfoPage';
import { NavBar } from './components/NavBar';
import { CoursesPage } from './pages/CoursesPage';
import { TimesPage } from './pages/TimesPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { pullSchedule } from './API';

export const App: FC = () => {
  const [schedule, setSchedule] = useState<Schedule>({} as never);
  const [loading, setLoading] = useState(true);

  const refreshSchedule = useCallback(async () => {
    const newSched = await pullSchedule();
    setSchedule(newSched);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshSchedule();
  }, [refreshSchedule]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <SchedulerContext.Provider value={{ schedule, refreshSchedule }}>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/times" element={<TimesPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
        </Routes>
      </Container>
    </SchedulerContext.Provider>
  );
};
