import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Editor from '../../Editor';

// import styles from './RHFEditor.module.sass';

function RHFEditor({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <Editor
          // state={value}
          onChange={onChange}
          onBlur={onBlur}
          //   classEditor={styles.editor}
          label="Bio"
        />
      )}
    />
  );
}

export default RHFEditor;
