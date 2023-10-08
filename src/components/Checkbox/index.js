import React from 'react';
import cn from 'classnames';
import styles from './Checkbox.module.sass';
import { Stack } from 'react-bootstrap';

const Checkbox = ({
  className,
  classCheckboxTick,
  content,
  value,
  onChange,
  reverse,
}) => {
  return (
    <div>
      <Stack className={cn('py-2', styles.container)} direction="horizontal">
        {content && <span className={styles.label}>{content}</span>}
        <input
          className={cn('ms-auto', styles.checkbox)}
          type="checkbox"
          onChange={onChange}
          checked={value}
        />
      </Stack>
    </div>
  );
};

export default Checkbox;
