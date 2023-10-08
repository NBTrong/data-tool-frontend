import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Checkbox from '../../Checkbox';

function RHFCheckbox({ name, content, onSelect, ...others }) {
  const { control } = useFormContext();
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Checkbox
            content={content}
            value={value}
            onChange={(e) => {
              onSelect();
              onChange(e);
            }}
            reverse={false}
          />
        )}
      />
    </>
  );
}

export default RHFCheckbox;
