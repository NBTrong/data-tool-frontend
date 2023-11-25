import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import cn from 'classnames';
import styles from './ScheduleKOC.module.sass';

import moment from 'moment';

import Item from './Item';

const Schedule = ({ startDate, setStartDate }) => {
  const [visibleDate, setVisibleDate] = useState(false);

  const handleResetClick = () => {
    setStartDate(null);
    setVisibleDate(false);
  };

  return (
    <Item
      className={styles.item}
      category="Date"
      icon="calendar"
      value={startDate && moment(startDate).format('MMMM Do, yyyy')}
      visible={visibleDate}
      setVisible={setVisibleDate}
    >
      <div className={styles.date}>
        <DatePicker
          className="border-0"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormatCalendar={'MMMM yyyy'}
          inline
        />
        <div className={styles.foot}>
          <button
            className={cn('button-stroke button-small', styles.button)}
            onClick={(e) => {
              handleResetClick();
              e.preventDefault();
            }}
          >
            Clear
          </button>
          <button
            className={cn('button-small', styles.button)}
            onClick={(e) => {
              setVisibleDate(false);
              e.preventDefault();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Item>
  );
};

export default Schedule;
