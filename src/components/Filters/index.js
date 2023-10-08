import React, { useState, createContext, useMemo } from 'react';
import cn from 'classnames';
import styles from './Filters.module.sass';
import Icon from '../Icon';

export const FiltersContext = createContext();

const Filters = ({ className, children, title }) => {
  const [visible, setVisible] = useState(false);

  const FiltersContextValue = useMemo(() => {
    return {
      visible,
      setVisible,
    };
  }, [visible]);

  return (
    <div
      className={cn(styles.filters, className, { [styles.active]: visible })}
    >
      <button
        className={cn(styles.buttonSecondary, styles.head, ' fs-mobile')}
        onClick={() => setVisible(true)}
      >
        <Icon name="filter" size="24" />
      </button>
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={cn('title-red', styles.title)}>{title}</div>
          <button className={styles.close} onClick={() => setVisible(false)}>
            <Icon name="close" size="20" />
          </button>
        </div>
        <FiltersContext.Provider value={FiltersContextValue}>
          {children}
        </FiltersContext.Provider>
      </div>
      <div className={styles.overlay} onClick={() => setVisible(false)}></div>
    </div>
  );
};

export default Filters;
