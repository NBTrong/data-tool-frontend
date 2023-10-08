import React, { useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './Dropdown.module.sass';
import Tooltip from '../Tooltip';
import Icon from '../Icon';

const Dropdown = ({
  className,
  classDropdownHead,
  classDropdownBody,
  classDropdownLabel,
  value,
  setValue,
  options,
  label,
  tooltip,
  small,
  upBody,
  invisibleLabel,
  textFrontOfValue = '',
  childrenOptions = '',
  ...others
}) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (value) => {
    setValue(value);
    setVisible(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      {label && (
        <div className={cn(styles.label, invisibleLabel, classDropdownLabel)}>
          {label}{' '}
          {tooltip && (
            <Tooltip
              className={styles.tooltip}
              title={tooltip}
              icon="info"
              place="right"
            />
          )}
        </div>
      )}
      <div
        className={cn(
          styles.dropdown,
          className,
          { [styles.small]: small },
          {
            [styles.active]: visible,
          },
        )}
      >
        <div
          className={cn(styles.head, classDropdownHead)}
          onClick={() => setVisible(!visible)}
        >
          <div
            className={styles.selection}
            dangerouslySetInnerHTML={{ __html: textFrontOfValue + value }}
          ></div>
        </div>
        <div
          className={cn(styles.body, classDropdownBody, {
            [styles.bodyUp]: upBody,
          })}
        >
          {options.map((x, index) => (
            <div
              className={cn(styles.option, {
                [styles.selectioned]: x === value,
              })}
              onClick={() => handleClick(x, index)}
              key={index}
            >
              <div className={'d-flex justify-content-between'}>
                <p
                  className={'d-flex align-items-center'}
                  dangerouslySetInnerHTML={{ __html: x }}
                ></p>
                <Icon name="check" size="24" fill={'white'} />
              </div>
            </div>
          ))}
          {childrenOptions}
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
