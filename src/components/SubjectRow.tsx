import React, { FC } from 'react';
import { Subject } from '../models/Schedule';
import { Badge, ListGroupItem } from 'reactstrap';
import { HorizontalStack } from '.';

export const SubjectRow: FC<{
  readonly subject: Subject;
  readonly report: () => void;
  readonly isStriped?: boolean;
}> = ({ subject, report, isStriped }) => {
  return (
    <ListGroupItem
      className={`border-0 rounded-0 p-0${isStriped ? ' list-group-item-secondary' : ''}`}
      onClick={report}
    >
      <HorizontalStack className={`py-1 px-2`} gap={1}>
        <Badge color="dark">{subject.code}</Badge>
        <div>{subject.name}</div>
      </HorizontalStack>
    </ListGroupItem>
  );
};
