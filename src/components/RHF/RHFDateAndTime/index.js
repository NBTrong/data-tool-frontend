import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

import styles from './RHFDateAndTime.module.sass';
import cn from 'classnames';

import Item from './Item';
import Icon from '../../Icon';
import moment from 'moment/moment';
import Tooltip from '../../Tooltip';

const RHFDateAndTime = ({
  name,
  className,
  classLabel,
  classError,
  label = 'Label',
  place = 'right',
  tooltip = 'This is tooltip',
  disabled = false,
}) => {
  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);

  const { control, reset } = useFormContext();

  return (
    <div className={className}>
      <div className={cn(classLabel, styles.label)}>
        {label}{' '}
        <Tooltip
          className={cn(false ? styles.tooltipError : styles.tooltip)}
          title={tooltip}
          icon="info"
          place={place}
          error={true}
        />
      </div>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <Item
              className="mb-3"
              category="Date"
              icon="calendar"
              value={value && moment(value).format('MMMM DD, yyyy')}
              visible={visibleDate && !disabled}
              setVisible={setVisibleDate}
            >
              <div className={styles.date}>
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  dateFormatCalendar={'MMMM yyyy'}
                  defaultValue={new Date('2023-02-02')}
                  inline
                  readOnly={true}
                />

                <div className={styles.foot}>
                  <p
                    className={cn('button-stroke button-small me-2')}
                    onClick={() => reset()}
                  >
                    Clear
                  </p>
                  <p
                    className={cn('button-small')}
                    onClick={() => setVisibleDate(false)}
                  >
                    Save
                  </p>
                </div>
              </div>
            </Item>
            <Item
              category="Time"
              icon="clock"
              value={value && moment(value).format('h:mm A')}
              visible={visibleTime && !disabled}
              setVisible={setVisibleTime}
            >
              <div className={styles.time}>
                <div className={styles.top}>
                  <div className={styles.subtitle}>
                    {value && moment(value).format('h:mm A')}
                  </div>
                  <button
                    className={styles.close}
                    onClick={() => setVisibleTime(false)}
                  >
                    <Icon name="close" size="20" />
                  </button>
                </div>
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption={false}
                  inline
                  readOnly={true}
                />
                <div className={styles.foot}>
                  <p
                    className={cn('button-stroke button-small me-2')}
                    onClick={() => reset()}
                  >
                    Clear
                  </p>
                  <p
                    className={cn('button-small')}
                    onClick={() => setVisibleTime(false)}
                  >
                    Save
                  </p>
                </div>
              </div>
            </Item>
            {error ? (
              <p className={cn(styles.redLine, classError)}>{error.message}</p>
            ) : (
              <p className={cn(styles.hidden, styles.redLine, classError)}>.</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default RHFDateAndTime;
