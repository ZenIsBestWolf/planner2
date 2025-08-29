import React, { FC } from 'react';
import { Alert } from 'reactstrap';
import { ConstructionAlert } from '../components/ConstructionAlert';

export const SchedulesPage: FC = () => {
  return (
    <>
      <ConstructionAlert />
      <h2>Schedules Page</h2>
    </>
  );
};
