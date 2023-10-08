import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import cn from 'classnames';
import styles from './RHFFile.module.sass';

import Icon from '../../Icon';
import RHFLabel from '../RHFLabel';

function RHFFile({
  name,
  className,
  classError,
  label,
  placeholder,
  classLabel,
  tooltip,
  ...others
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <div className={cn(styles.file, className)}>
            {label && (
              <RHFLabel
                label={label}
                classLabel={cn('mb-2', classLabel)}
                tooltip={tooltip}
              />
            )}

            <div className={styles.wrap}>
              <input
                className={styles.input}
                type="file"
                accept={[
                  '.csv',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/vnd.ms-excel',
                ].join(', ')}
                onChange={(e) => {
                  onChange(e?.target?.files[0]);
                  others?.onChange?.(e?.target?.files[0]);
                }}
              />
              <button className={styles.box}>
                {!value.name && <Icon name="upload" size="24" />}
                {value.name || placeholder}
              </button>
            </div>
          </div>

          <p
            className={cn(styles.redLine, classError, {
              [styles.hidden]: !!error,
            })}
          >
            {error?.message}
          </p>
        </>
      )}
    />
  );
}

export default RHFFile;
