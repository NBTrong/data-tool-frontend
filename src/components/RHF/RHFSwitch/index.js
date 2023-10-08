import { Controller, useFormContext } from 'react-hook-form';

import Switch from '../../Switch';

function RHFSwitch({ name, ...others }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Switch value={value} onChange={onChange} {...others} />
      )}
    />
  );
}

export default RHFSwitch;
