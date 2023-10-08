import React, { useState, createContext, useMemo } from 'react';
import cn from 'classnames';
import styles from './FilterConfigIcon.module.sass';
import Icon from '../Icon';
import {HiOutlinePlusCircle} from "react-icons/hi";

export const FiltersConfigContext = createContext();

const FilterConfigIcon = ({ className, children, title,btnClass,customIcon }) => {
  const [visible, setVisible] = useState(false);

  const FiltersConfigContextValue = useMemo(() => {
    return {
      visible,
      setVisible,
    };
  }, [visible]);

  return (
    <div
      className={cn(styles.filters, className, { [styles.active]: visible })}
    >
      <button className={btnClass}
        onClick={() => setVisible(true)}
      >
        {customIcon}
      </button>
      <div className={cn(styles.body,'mt-4')}>
        <div className={styles.top}>
          <div className={cn('title-red', styles.title)}>{title}</div>
          <button className={styles.close} onClick={() => setVisible(false)}>
            <Icon name="close" size="20" />
          </button>
        </div>
        <FiltersConfigContext.Provider value={FiltersConfigContextValue}>
          {children}
        </FiltersConfigContext.Provider>
      </div>
      <div className={styles.overlay} onClick={() => setVisible(false)}></div>
    </div>
  );
};

export default FilterConfigIcon;
