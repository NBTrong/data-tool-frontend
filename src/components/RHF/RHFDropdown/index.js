import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Dropdown from '../../Dropdown';

export default function RHFDropdown({
  name,
  data,
  defaultValue,
  childrenOptions,
  setValueSelected = () => {},
  ...others
}) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <Dropdown
              value={value || defaultValue}
              setValue={(e) => {
                onChange(e);
                setValueSelected(e);
              }}
              onBlur={onBlur}
              options={data}
              childrenOptions={childrenOptions}
              {...others}
            />
          </>
        )}
      />
    </>
  );
}
