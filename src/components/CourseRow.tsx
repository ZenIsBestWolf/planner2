import React, { FC } from 'react';
import { Button, ButtonToolbar, ListGroupItem } from 'reactstrap';
import { HorizontalStack } from '.';
import {
  Course,
  isSemester,
  isTerm,
  TermPeriod,
  termPeriods,
  TermStatus,
} from '../models/Schedule';
import { CourseBrowserReducerAction } from '../pages/CoursesPage';
import { getCourseAvailability, getCourseTerms, noop } from '../utils';
import { TermButton } from './TermButton';

export const CourseRow: FC<{
  readonly course: Course;
  readonly added: boolean;
  readonly striped: boolean;
  reporter: (action: CourseBrowserReducerAction) => void;
}> = ({ course, added, reporter, striped }) => {
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
        <TermGroup reporter={noop} course={course} />
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

const fillUnavailableTerms = (
  course: Course,
  statuses: Map<TermPeriod, TermStatus>,
): Map<TermPeriod, TermStatus> => {
  const result = new Map<TermPeriod, TermStatus>();

  const terms = getCourseTerms(course);

  const hasSemesters = terms.map((t) => isSemester(t)).includes(true);
  const hasTerms = terms.map((t) => isTerm(t)).includes(true);

  for (const term of termPeriods) {
    const lookup = statuses.get(term);
    if (lookup) {
      result.set(term, lookup);
      continue;
    }

    if (hasSemesters && isSemester(term)) {
      result.set(term, 'Unavailable');
    }

    if (hasTerms && isTerm(term)) {
      result.set(term, 'Unavailable');
    }
  }

  return result;
};

interface TermGroupProps {
  readonly course: Course;
  readonly reporter: (term: TermPeriod, status: string) => void;
}

const TermGroup: FC<TermGroupProps> = ({ course }) => {
  const termStatuses = fillUnavailableTerms(course, getCourseAvailability(course));

  return (
    <ButtonToolbar className="gap-2">
      {termPeriods.map((term, idx) => (
        <TermButton
          displayOnly
          key={`term-${term}-${idx}`}
          term={term}
          status={termStatuses.get(term)}
          reporter={noop}
        />
      ))}
    </ButtonToolbar>
  );
};
