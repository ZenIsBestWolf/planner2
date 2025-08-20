import React, { FC } from 'react';
import { Button, ButtonToolbar, ListGroupItem } from 'reactstrap';
import { HorizontalStack } from '.';
import { Course, TermPeriod, termPeriods } from '../models/Schedule';
import { CourseBrowserReducerAction } from '../pages/CoursesPage';
import { noop } from '../utils';
import { TermButton } from './TermButton';

export const CourseRow: FC<{
  readonly course: Course;
  readonly schedules: TermPeriod[];
  readonly added: boolean;
  readonly striped: boolean;
  reporter: (action: CourseBrowserReducerAction) => void;
}> = ({ course, added, reporter, schedules, striped }) => {
  return (
    <ListGroupItem
      className={`border-0 rounded-0 p-0${striped ? ' list-group-item-secondary' : ''}`}
    >
      <HorizontalStack
        className={`p-2`}
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
          {course.subject.code} {course.code} - {course.title}
        </div>
        {/* Spacer */}
        <div className="ms-auto" />
        <TermGroup reporter={noop} schedules={schedules} />
      </HorizontalStack>
    </ListGroupItem>
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
      aria-label={isAdded ? 'Remove course' : 'Add course'}
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

const getTermStatus = (targetTerm: TermPeriod, allTerms: TermPeriod[]): TermStatus | undefined => {
  switch (targetTerm) {
    case 'A':
    case 'B': {
      if (allTerms.includes('Fall')) {
        return undefined;
      }

      return 'Available';
    }

    case 'C':
    case 'D': {
      if (allTerms.includes('Spring')) {
        return undefined;
      }

      return 'Available';
    }

    case 'E1':
    case 'E2': {
      if (allTerms.includes('Summer')) {
        return undefined;
      }

      return 'Available';
    }

    default:
      return 'Available';
  }
};

const TermGroup: FC<TermGroupProps> = ({ schedules }) => {
  const termStatuses = new Map<TermPeriod, TermStatus>();
  for (const term of termPeriods) {
    const lookup = schedules.find((t) => t === term);

    const status = lookup ? getTermStatus(term, schedules) : 'Unavailable';
    if (status) {
      termStatuses.set(term, status);
    }
  }

  return (
    <ButtonToolbar className="gap-2">
      {termPeriods.map((term, idx) => {
        return (
          <TermButton
            displayOnly
            key={`term-${term}-${idx}`}
            term={term}
            status={termStatuses.get(term)}
            reporter={noop}
          />
        );
      })}
    </ButtonToolbar>
  );
};
