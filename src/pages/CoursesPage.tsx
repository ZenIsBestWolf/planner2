import React, { FC, useCallback, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { CourseRow } from '../components/CourseRow';
import { Course, ShallowCourse, Subject } from '../models/Schedule';
import { SubjectRow } from '../components/SubjectRow';
import { useApp, useUpdateApp } from '../providers';
import { VerticalStack } from '../components';

export const CoursesPage: FC = () => {
  const dummyCourse: Course = {
    academicLevel: 'Undergraduate',
    credits: 3,
    code: 'CS 3013',
    deliveryMode: 'In-Person',
    endDate: new Date(),
    enrollment: {
      disabled: true,
      remaining: 0,
      maximum: 30,
    },
    format: 'Lecture',
    locations: ['Fuller Labs Lower'],
    notes: 'Course code for Undergraduate Operating Systems',
    patterns: [
      {
        days: ['T', 'F'],
        startTime: {
          hour: 9,
          minute: 0,
        },
        endTime: {
          hour: 10,
          minute: 50,
        },
        locationId: 'Fuller Lower',
      },
    ],
    startDate: new Date(),
    subject: {
      code: 'CS',
      name: 'Computer Science',
    },
    tags: {},
    title: 'Operating Systems',
    term: 'C',
    waitlist: {
      disabled: false,
      remaining: 10,
      maximum: 20,
    },
  };

  const dummyCourse2: Course = {
    academicLevel: 'Undergraduate',
    credits: 3,
    code: 'CS 4341',
    deliveryMode: 'In-Person',
    endDate: new Date(),
    enrollment: {
      disabled: true,
      remaining: 0,
      maximum: 30,
    },
    format: 'Lecture',
    locations: ['Fuller Labs Lower'],
    notes: 'Course code for Webware',
    patterns: [
      {
        days: ['M', 'R'],
        startTime: {
          hour: 9,
          minute: 0,
        },
        endTime: {
          hour: 10,
          minute: 50,
        },
        locationId: 'Fuller Lower',
      },
    ],
    startDate: new Date(),
    subject: {
      code: 'CS',
      name: 'Computer Science',
    },
    tags: {},
    title: 'Webware',
    term: 'C',
    waitlist: {
      disabled: false,
      remaining: 10,
      maximum: 20,
    },
  };

  const dummySubjects: Subject[] = [
    {
      code: 'CS',
      name: 'Computer Science',
    },
    {
      code: 'AR',
      name: 'Art',
    },
  ];

  const dummyCourses: Course[] = [dummyCourse, dummyCourse2];

  const [selectedCourse, setSelectedCourse] = useState<ShallowCourse | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  return (
    <Row className="border-bottom border-dark">
      <SubjectBrowserSection
        reporter={setSelectedSubject}
        subjects={dummySubjects}
        selectedSubject={selectedSubject}
      />
      <CourseBrowserSection reporter={setSelectedCourse} courses={dummyCourses} />
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

  const resolveAdded = useCallback(
    (sc: ShallowCourse) => {
      return app.selectedCourses.includes(sc.code);
    },
    [app.selectedCourses],
  );

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
      <VerticalStack>
        {courses.map((course, idx) => {
          return (
            <CourseRow
              striped={idx % 2 === 1}
              reporter={(action: CourseBrowserReducerAction) => {
                handleReporting(course, action);
              }}
              added={resolveAdded(course)}
              key={`course-${course.subject.code}-${course.code}`}
              course={course}
              schedules={['A', 'B', 'C', 'D', 'E1']}
            />
          );
        })}
      </VerticalStack>
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
    </Col>
  );
};

interface CourseInfoSectionProps {
  course?: ShallowCourse;
}

const CourseInfoSection: FC<CourseInfoSectionProps> = ({ course }) => {
  return <Col xs="3">{course && <span>Course Info display for {course.code}</span>}</Col>;
};
