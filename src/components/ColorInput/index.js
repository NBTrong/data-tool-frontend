import React, { useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';

import cn from 'classnames';
import styles from './ColorInput.module.sass';

import { Tooltip } from '..';

function ColorInput({
  value,
  setValue,
  onBlur,
  label,
  tooltip,
  classHeader,
  ...others
}) {
  const [colorModal, setColorModal] = useState(false);
  const [btnColor, setBtnColor] = useState('#fff');

  const handleChange = (color) => {
    setBtnColor(color.hex);
    setColorModal(false);
    if (value !== color.hex) setValue(color.hex);
  };

  const buttonColorStyle = {
    backgroundColor: btnColor,
    cursor: 'pointer',
  };

  useEffect(() => {
    if (value) setBtnColor(value);
  }, [value]);

  return (
    <>
      <div className={cn(styles.head, classHeader)}>
        <div className={styles.label}>
          {label}{' '}
          <Tooltip
            className={styles.tooltip}
            title={tooltip}
            icon="info"
            place="right"
          />
        </div>
      </div>
      <div className={cn('mb-3', styles.tags)}>
        <span
          style={buttonColorStyle}
          className="rounded-circle border px-3 py-2 "
          onClick={() => setColorModal(true)}
        />
        {colorModal && (
          <CirclePicker
            className="pt-3 mb-3"
            colors={[
              '#f44336',
              '#e91e63',
              '#9c27b0',
              '#673ab7',
              '#3f51b5',
              '#2196f3',
              '#03a9f4',
              '#00bcd4',
              '#009688',
              '#4caf50',
              '#8bc34a',
              '#cddc39',
              '#ffeb3b',
              '#ffc107',
              '#ff9800',
              '#ff5722',
              '#795548',
              '#607d8b',
            ]}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
}

export default ColorInput;
