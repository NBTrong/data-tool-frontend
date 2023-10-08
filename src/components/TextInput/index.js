import React from 'react';

import styles from './TextInput.module.sass';
import cn from 'classnames';

import { Icon, Tooltip } from '../';

const TextInput = ({
  className,
  classLabel,
  classInput,
  label,
  icon,
  name,
  copy,
  currency,
  tooltip,
  place,
  value,
  error,
  ...props
}) => {
  return (
    <div
      className={cn(
        styles.field,
        { [styles.fieldIcon]: icon },
        { [styles.fieldCopy]: copy },
        { [styles.fieldCurrency]: currency },
        className,
      )}
    >
      {label && (
        <div className={cn(classLabel, styles.label)}>
          {label}{' '}
          {tooltip && (
            <Tooltip
              className={cn(error ? styles.tooltipError : styles.tooltip)}
              title={tooltip}
              icon="info"
              place={place ? place : 'right'}
              error={true}
            />
          )}
        </div>
      )}
      <div className={styles.wrap}>
        <input
          name={name}
          defaultValue={value}
          className={cn(classInput, styles.input)}
          {...props}
        />
        {icon && (
          <div className={styles.icon}>
            <Icon name={icon} size="24" />{' '}
          </div>
        )}
        {copy && (
          <button className={styles.copy}>
            <Icon name="copy" size="24" />{' '}
          </button>
        )}
        {currency && <div className={styles.currency}>{currency}</div>}
      </div>
    </div>
  );
};

export default TextInput;
