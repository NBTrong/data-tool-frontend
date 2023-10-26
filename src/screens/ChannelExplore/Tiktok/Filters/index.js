import React, { useEffect, useState, useContext } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';

import cn from 'classnames';
import styles from './Settings.module.sass';

import Schedule from './ScheduleKOC';
import useQueryString from '../../../../hooks/useQueryString';
import { FiltersContext } from '../../../../components/Filters';

const Filters = () => {
  const { setVisible } = useContext(FiltersContext);

  const { queryString, setQueryString } = useQueryString();

  const { from, to } = queryString;

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const method = useForm({});

  const handleApply = (data) => {
    const params = {
      ...queryString,
    };
    if (startDate) {
      params.from = moment(startDate).unix();
    }
    if (endDate) {
      params.to = moment(endDate).unix();
    }
    params.page = 1;
    setQueryString(params);
    setVisible(false);
  };

  const handleReset = () => {
    const params = {
      ...queryString,
    };
    delete params.from;
    delete params.to;
    delete params.search;
    delete params.page;
    setQueryString(params);
    method.reset();

    setVisible(false);
  };

  useEffect(() => {
    if (from) {
      setStartDate(new Date(Number(from) * 1000));
    } else {
      setStartDate(null);
    }
  }, [from]);

  useEffect(() => {
    if (to) {
      setEndDate(new Date(Number(to) * 1000));
    } else {
      setEndDate(null);
    }
  }, [to]);

  return (
    <>
      <FormProvider {...method}>
        <form onSubmit={method.handleSubmit(handleApply)}>
          <div>
            <div>
              <div className="pb-3 pt-4 border-top">
                <div className="mb-2">
                  From <AiFillInfoCircle className="fs-5 pb-1 text-secondary" />
                </div>
                <Schedule
                  name="schedule-start"
                  startDate={startDate}
                  setStartDate={(date) => setStartDate(date)}
                />
              </div>
              <div className="pb-4 border-bottom">
                <div className="mb-2">
                  To <AiFillInfoCircle className="fs-5 pb-1 text-secondary" />
                </div>
                <Schedule
                  name="schedule-end"
                  startDate={endDate}
                  setStartDate={(date) => setEndDate(date)}
                />
              </div>
              <div className={styles.btns}>
                <button
                  className={cn('button-stroke', styles.button)}
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button className={cn('button', styles.button)}>Apply</button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default Filters;
