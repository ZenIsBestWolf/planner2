import React, { FC, useEffect } from 'react';
import { TermPeriod } from '../models/Schedule';
import { CourseBrowserReducerAction } from '../pages/CoursesPage';
import { useCheckboxState } from '../utils';
import { CheckboxButton } from '.';

type TermStatus = 'Available' | 'Waitlisted' | 'Full' | 'Disabled' | 'Unavailable';

interface TermButtonProps {
  readonly term: TermPeriod;
  // green = open seats
  // red = disabled
  // yellow = unavailable (waitlist full)
  // greyed out = unavailable (not offerred)
  // blue = waitlist only
  readonly status: TermStatus;
  readonly reporter: (status: CourseBrowserReducerAction) => void;
  readonly displayOnly?: boolean;
  readonly disabled?: boolean;
}

const colorReducer = (status: TermStatus) => {
  switch (status) {
    case 'Available':
      return 'success';
    case 'Disabled':
      return 'danger';
    case 'Full':
      return 'warning';
    case 'Unavailable':
      return 'secondary';
    case 'Waitlisted':
      return 'primary';
  }
};

export const TermButton: FC<TermButtonProps> = ({
  term,
  status,
  displayOnly,
  disabled,
  reporter,
}) => {
  const [state, setState] = useCheckboxState(false);
  const color = colorReducer(status);
  const isDisabled = disabled ?? status === 'Unavailable';

  // Report changes in usage
  useEffect(() => {
    // reporter(term, state.toString());
  }, [reporter, state, term]);

  if (displayOnly) {
    return (
      <div
        className={`border border-secondary rounded-5 text-black bg-${color}-subtle p-1${isDisabled ? ' btn disabled' : ''}`}
      >
        {term}
      </div>
    );
  }

  return (
    <CheckboxButton
      onChange={setState}
      buttonClasses={`border border-secondary rounded-5 text-black bg-${color}-subtle p-1`}
      disabled={isDisabled}
    >
      {term}
    </CheckboxButton>
  );
};
