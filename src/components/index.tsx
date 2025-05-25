import React, { FC, ReactNode } from 'react';
import { Button, Input } from 'reactstrap';
import { CourseTime } from '../models/Schedule';
import { useApp } from '../providers';

/**
 * The props for utilizing {@Link CheckboxButton}
 *
 * @property {ReactNode} children The ReactNode to be placed as the content of the Button
 * @property {boolean} disabled Whether or not the input is disabled
 * @property {boolean} outline Whether or not the button is outlined
 * @property {string} color The Bootstrap color to apply to the Button
 * @property {string} id The id to use for the input. If none is provided, a random one will be used as it is required for the Input-Label relationship.
 * @property {string} buttonClasses Extra CSS classes to add to the button/label
 * @property {string} inputClasses Extra CSS classes to add to the input
 * @property {React.ChangeEventHandler<HTMLInputElement>} onChange The input change handler callback
 */
interface CheckboxButtonProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly outline?: boolean;
  readonly color?: string;
  readonly id?: string;
  readonly buttonClasses?: string;
  readonly inputClasses?: string;
  readonly onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * React Component for having a Checkbox styled Button
 * @param {CheckboxButtonProps} props Component properties
 * @returns Input and Label tag that accepts Button properties
 */
export const CheckboxButton: FC<CheckboxButtonProps> = ({
  children,
  disabled,
  outline,
  id,
  color,
  buttonClasses,
  inputClasses,
  onChange,
}) => {
  const inputId = id ?? `checkbox-${crypto.randomUUID()}`;
  return (
    <>
      <Input
        onChange={onChange}
        disabled={disabled}
        id={inputId}
        type="checkbox"
        className={`btn-check${inputClasses ? ` ${inputClasses}` : ``}`}
      />

      <Button
        tag="label"
        htmlFor={inputId}
        outline={outline}
        color={color}
        className={buttonClasses}
        disabled={disabled}
      >
        {children}
      </Button>
    </>
  );
};

/**
 * Provides a correctly rendered time for a course based on user preferences
 * @param props Props object containing a {@link CourseTime} object
 * @returns A React Fragment containing the rendered time
 */
export const Time: FC<{ time: CourseTime }> = ({ time }) => {
  const { showMeridian } = useApp();

  const hour = time.hour <= 12 ? time.hour : showMeridian ? time.hour % 12 : time.hour;

  return (
    <>
      {hour}:{time.minute}
      {showMeridian && hour < 12 ? ' AM' : ' PM'}
    </>
  );
};

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children?: ReactNode;
  readonly gap?: 1 | 2 | 3 | 4 | 5;
  readonly className?: string;
}

interface InnerStackProps extends StackProps {
  readonly stackStyle: 'vstack' | 'hstack';
}

const InnerStack: FC<InnerStackProps> = ({
  stackStyle,
  gap,
  children,
  className,
  ...attributes
}) => {
  return (
    <div
      {...attributes}
      className={`${stackStyle}${gap ? ` gap-${gap}` : ``}${className ? ` ${className}` : ``}`}
    >
      {children}
    </div>
  );
};

export const HorizontalStack: FC<StackProps> = (props) => {
  return <InnerStack stackStyle="hstack" {...props} />;
};

export const VerticalStack: FC<StackProps> = (props) => {
  return <InnerStack stackStyle="vstack" {...props} />;
};
