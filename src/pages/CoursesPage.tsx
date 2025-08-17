import React, { FC, useCallback, useState } from 'react';
import { Col, ListGroup, Row } from 'reactstrap';
import { CourseRow } from '../components/CourseRow';
import { SubjectRow } from '../components/SubjectRow';
import { Course, Subject } from '../models/Schedule';
import { useApp, useSchedule, useUpdateApp } from '../providers';
import { getCourseTerms } from '../utils';

export const CoursesPage: FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  return (
    <Row className="border-bottom border-dark">
      <SubjectBrowserSection reporter={setSelectedSubject} selectedSubject={selectedSubject} />
      <CourseBrowserSection reporter={setSelectedCourse} />
      <CourseInfoSection course={selectedCourse} />
    </Row>
  );
};

export type CourseBrowserReducerAction = 'addCourse' | 'removeCourse' | 'selectCourse';

interface CourseBrowserSectionProps {
  readonly reporter: (course: Course) => void;
}

const CourseBrowserSection: FC<CourseBrowserSectionProps> = ({ reporter }) => {
  const app = useApp();
  const { courses } = useSchedule();
  const updateApp = useUpdateApp();

  const resolveAdded = useCallback(
    (sc: Course) => {
      return app.selectedCourses.includes(sc.code);
    },
    [app.selectedCourses],
  );

  const handleReporting = useCallback(
    (sc: Course, action: CourseBrowserReducerAction) => {
      switch (action) {
        case 'addCourse': {
          if (!resolveAdded(sc)) {
            updateApp('selectedCourses', [...app.selectedCourses, sc.code]);
          }
          break;
        }

        case 'removeCourse': {
          if (resolveAdded(sc)) {
            updateApp('selectedCourses', [...app.selectedCourses.filter((c) => c !== sc.code)]);
          }
          break;
        }

        case 'selectCourse': {
          reporter(sc);
          break;
        }

        default: {
          throw Error('Unknown action');
        }
      }
    },
    [app.selectedCourses, reporter, resolveAdded, updateApp],
  );

  return (
    <Col xs="6" className="border-start border-end border-dark p-0">
      <ListGroup>
        {courses.map((course, idx) => {
          const hash = crypto.randomUUID();
          const terms = getCourseTerms(course);
          return (
            <CourseRow
              striped={idx % 2 === 1}
              reporter={(action: CourseBrowserReducerAction) => {
                handleReporting(course, action);
              }}
              added={resolveAdded(course)}
              key={`course-${course.subject.code}-${course.code}-${hash}`}
              course={course}
              schedules={terms}
            />
          );
        })}
      </ListGroup>
    </Col>
  );
};

interface SubjectBrowserSectionProps {
  readonly selectedSubject?: Subject;
  readonly reporter: (s: Subject) => void;
}

const SubjectBrowserSection: FC<SubjectBrowserSectionProps> = ({ reporter }) => {
  const { subjects } = useSchedule();
  return (
    <Col xs="3" className="p-0">
      <ListGroup>
        {subjects.map((subject, idx) => {
          return (
            <SubjectRow
              report={() => {
                reporter(subject);
              }}
              subject={subject}
              key={`subject-${subject.code}`}
              isStriped={idx % 2 === 1}
            />
          );
        })}
      </ListGroup>
    </Col>
  );
};

interface CourseInfoSectionProps {
  course?: Course;
}

const CourseInfoSection: FC<CourseInfoSectionProps> = ({ course }) => {
  return <Col xs="3">{course && <span>Course Info display for {course.code}</span>}</Col>;
};
