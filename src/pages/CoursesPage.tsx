import React, { FC, useCallback, useState } from 'react';
import { Col, ListGroup, Row } from 'reactstrap';
import { CourseRow } from '../components/CourseRow';
import { SubjectRow } from '../components/SubjectRow';
import { Course, ShallowCourse, Subject } from '../models/Schedule';
import { useApp, useSchedule, useUpdateApp } from '../providers';

export const CoursesPage: FC = () => {
  const { courses, subjects } = useSchedule();

  const [selectedCourse, setSelectedCourse] = useState<ShallowCourse | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  return (
    <Row className="border-bottom border-dark">
      <SubjectBrowserSection
        reporter={setSelectedSubject}
        subjects={subjects}
        selectedSubject={selectedSubject}
      />
      <CourseBrowserSection reporter={setSelectedCourse} courses={courses} />
      <CourseInfoSection course={selectedCourse} />
    </Row>
  );
};

export type CourseBrowserReducerAction = 'addCourse' | 'removeCourse' | 'selectCourse';

interface CourseBrowserSectionProps {
  readonly courses: ShallowCourse[];
  readonly reporter: (course: ShallowCourse) => void;
}

const CourseBrowserSection: FC<CourseBrowserSectionProps> = ({ courses, reporter }) => {
  const app = useApp();
  const updateApp = useUpdateApp();
  const schedule = useSchedule();

  const resolveAdded = useCallback(
    (sc: ShallowCourse) => {
      return app.selectedCourses.includes(sc.code);
    },
    [app.selectedCourses],
  );

  const getFullCourse = (sc: ShallowCourse): Course | undefined => {
    const course = schedule.courses.find((v) => {
      const nv = v as ShallowCourse;
      return nv === sc;
    });

    return course;
  };

  const handleReporting = useCallback(
    (sc: ShallowCourse, action: CourseBrowserReducerAction) => {
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
          const fullCourse = getFullCourse(course);
          return (
            <CourseRow
              striped={idx % 2 === 1}
              reporter={(action: CourseBrowserReducerAction) => {
                handleReporting(course, action);
              }}
              added={resolveAdded(course)}
              key={`course-${course.subject.code}-${course.code}-${hash}`}
              course={course}
              schedules={fullCourse ? [fullCourse.term] : []}
            />
          );
        })}
      </ListGroup>
    </Col>
  );
};

interface SubjectBrowserSectionProps {
  readonly subjects: Subject[];
  readonly selectedSubject?: Subject;
  readonly reporter: (s: Subject) => void;
}

const SubjectBrowserSection: FC<SubjectBrowserSectionProps> = ({ subjects, reporter }) => {
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
  course?: ShallowCourse;
}

const CourseInfoSection: FC<CourseInfoSectionProps> = ({ course }) => {
  return <Col xs="3">{course && <span>Course Info display for {course.code}</span>}</Col>;
};
