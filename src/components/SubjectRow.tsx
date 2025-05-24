import React, { FC } from 'react';
import { Subject } from '../models/Schedule';
import { Badge } from 'reactstrap';
import { HorizontalStack } from '.';

export const SubjectRow: FC<{
  readonly subject: Subject;
  readonly report: () => void;
  readonly isStriped?: boolean;
}> = ({ subject, report, isStriped }) => {
  return (
    <div onClick={report}>
      <HorizontalStack
        className={`border-bottom py-1 px-2${isStriped ? ` bg-secondary-subtle` : ``}`}
        gap={1}
      >
        <Badge color="dark">{subject.code}</Badge>
        <div>{subject.name}</div>
      </HorizontalStack>
    </div>
  );
};
