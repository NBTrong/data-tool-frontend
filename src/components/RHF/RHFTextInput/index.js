import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './RHFTextInput.module.sass';

import TextInput from '../../TextInput';

RHFTextInput.propTypes = {
  name: PropTypes.string,
};

function RHFTextInput({ name, ...others }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <TextInput
            name={name}
            className={styles.field}
            value={value}
            onChange={onChange}
            error={error}
            {...others}
          />
          {error ? (
            <p className={styles.redLine}>{error.message}</p>
          ) : (
            <p className={cn(styles.hidden, styles.redLine)}>.</p>
          )}
        </>
      )}
    />
  );
}

export default RHFTextInput;
