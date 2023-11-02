import React, { useEffect, useState, useContext } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';

import cn from 'classnames';
import styles from './Settings.module.sass';

import Schedule from './ScheduleKOC';
import useQueryString from '../../../../hooks/useQueryString';
import { FiltersContext } from '../../../../components/Filters';
import {RHFDropdown} from "../../../../components";
import {useMemo} from "@types/react";

const countryFields = [
  {
    name: `<img src="/images/content/ic_language_vn.svg"/>&nbsp; <span class="text-nowrap">Vietnam (VN)</span>`,
    value: 'vn',
  },
  {
    name: `<img style="width: 21px" src="/images/content/ic_language_th.png"/>&nbsp; <span class="text-nowrap">Thailand (TH)</span>`,
    value: 'th',
  },
];

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
    params.page = 1;
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

  const handleSetCountry = (country) => {
    setQueryString({
      ...queryString,
      country: countryFields.find(({ name }) => {
        return name === country;
      }).value,
    });
  };

  const parseCountryText = useMemo(() => {
    const name =
        countryFields.find((field) => field.value === country)?.name ??
        countryFields[0].name;
    return name;
  }, [country]);

  return (
    <>
      <FormProvider {...method}>
        <form onSubmit={method.handleSubmit(handleApply)}>
          <div>
            <div>
              <RHFDropdown
                  setValueSelected={handleSetCountry}
                  classDropdownHead={'bg-white text-gray fw-bold min-width-200'}
                  className={cn(
                      'rounded-3 text-gray me-2',
                  )}
                  textFrontOfValue={''}
                  defaultValue={parseCountryText}
                  name="country"
                  data={countryFields.map((item) => item.name)}
              />
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
