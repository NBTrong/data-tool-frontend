import React, {useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import cn from 'classnames';
import styles from './Settings.module.sass';

import useQueryString from '../../../../hooks/useQueryString';
import {RHFDropdown, Tooltip} from "../../../../components";
import {BiTimeFive} from "react-icons/bi";

const countryFields = [
  {
    name: `All time`,
    value: '0',
  },
  {
    name: `Yesterday`,
    value: '1',
  },
  {
    name: `This week`,
    value: '7',
  },
  {
    name: `This month`,
    value: '30',
  },
  {
    name: `Last 3 months`,
    value: '30',
  },
  {
    name: `Last 6 months`,
    value: '180',
  }
];

const Filters = ({isDisabled}) => {
  const { queryString, setQueryString } = useQueryString();

  const {publish_time} = queryString;

  const method = useForm({});

  const handleSetCountry = (country) => {
    setQueryString({
      ...queryString,
      publish_time: countryFields.find(({ name }) => {
        return name === country;
      }).value,
    });
  };

  const defaultValue = useMemo(() => {
    return publish_time ? countryFields.find(i=>i.value===publish_time).name : countryFields[0].name;
  }, [publish_time]);

  const handleClickDropdown = (e)=>{
    document.querySelector(".dropdownPublish_time").click()
  }

  return (
      <>
        <FormProvider {...method}>
          <form onSubmit={method.handleSubmit()}>
            <Tooltip title={isDisabled ? "Search hashtag cannot use duration" : ""}>
              <div className={isDisabled ? styles.disabled : ""}>
                <div className={'text-gray d-flex align-items-center bg-white ps-3 rounded-3 border-app me-2 cursor-pointer'}>
                  <BiTimeFive onClick={handleClickDropdown} className={"fs-5"}/>
                  <RHFDropdown
                      id="dropdownPublish_time"
                      setValueSelected={handleSetCountry}
                      classDropdownHead={cn(styles.dropdown_duration,'text-gray bg-white fw-bold border-0 min-width-150 pe-0 dropdownPublish_time')}
                      className={cn(
                          'rounded-3 text-gray border-0 border-all-0 shadow-all-0 me-0',
                      )}
                      textFrontOfValue={''}
                      defaultValue={defaultValue}
                      name="country"
                      data={countryFields.map((item) => item.name)}
                  />
                </div>
              </div>
            </Tooltip>
          </form>
        </FormProvider>
      </>
  );
};

export default Filters;
