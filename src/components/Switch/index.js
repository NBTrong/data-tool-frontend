import React from 'react';

import cn from 'classnames';
import styles from './Switch.module.sass';

const Switch = ({ className, value, onChange }) => {
  return (
    <div>
      <p>KOC Information</p>
      <label className={cn(styles.switch, className)}>
        <input
          className={styles.input}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.inner}>
          <span className={styles.box}></span>
        </span>
      </label>
    </div>
  );
};

export default Switch;
