import React, { FC } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { HorizontalStack } from '.';
import { ShallowCourse, TermPeriod } from '../models/Schedule';
import { CourseBrowserReducerAction } from '../pages/CoursesPage';
import { noop } from '../utils';
import { TermButton } from './TermButton';

export const CourseRow: FC<{
  readonly course: ShallowCourse;
  readonly schedules: TermPeriod[];
  readonly added: boolean;
  readonly striped: boolean;
  reporter: (action: CourseBrowserReducerAction) => void;
}> = ({ course, added, reporter, schedules, striped }) => {
  return (
    <HorizontalStack
      className={`p-2 border-bottom border-dark-subtle ${striped ? `bg-secondary-subtle` : ``}`}
      gap={2}
      onClick={() => {
        reporter('selectCourse');
      }}
    >
      <CourseButton
        isAdded={added}
        reporter={() => {
          reporter(added ? 'removeCourse' : 'addCourse');
        }}
      />
      <div>
        {course.code} - {course.title}
      </div>
      {/* Spacer */}
      <div className="ms-auto" />
      <TermGroup reporter={noop} schedules={schedules} />
    </HorizontalStack>
  );
};

const CourseButton: FC<{
  isAdded: boolean;
  reporter: () => void;
}> = ({ isAdded, reporter }) => {
  return (
    <Button
      size="sm"
      color={isAdded ? 'danger' : 'success'}
      className="small rounded"
      onClick={reporter}
    >
      <i className={`bi bi-${isAdded ? 'dash' : 'plus'}-circle-fill`}></i>
    </Button>
  );
};

type TermStatus = 'Available' | 'Waitlisted' | 'Full' | 'Disabled' | 'Unavailable';

interface TermGroupProps {
  readonly schedules: TermPeriod[];
  readonly reporter: (term: TermPeriod, status: string) => void;
}

const TermGroup: FC<TermGroupProps> = ({ schedules }) => {
  const statuses: TermStatus[] = ['Available', 'Waitlisted', 'Full', 'Disabled', 'Unavailable'];
  return (
    <ButtonToolbar className="gap-2">
      {schedules.map((term, idx) => {
        return (
          <TermButton
            displayOnly
            key={`term-${term}-${idx}`}
            term={term}
            status={statuses[idx]}
            reporter={noop}
          />
        );
      })}
    </ButtonToolbar>
  );
};
