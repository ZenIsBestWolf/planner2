import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

export const useObjectState = <T extends object>(
  initialState: T,
): [T, (key: keyof T, value: T[keyof T]) => void, Dispatch<SetStateAction<T>>] => {
  const [object, setObject] = useState<T>(initialState);

  const dispatch = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      setObject({
        ...object,
        [key]: value,
      });
    },
    [object, setObject],
  );

  return [object, dispatch, setObject];
};

export const useCheckboxState = (
  defaultValue: boolean,
): [boolean, (event: ChangeEvent<HTMLInputElement>) => void, (value: boolean) => void] => {
  const [value, setValue] = useState(defaultValue);
  const setter = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.checked);
  }, []);

  return [value, setter, setValue];
};

export const noop = (): void => {
  /* noop */
};
