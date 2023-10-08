import React from 'react';
import cn from 'classnames';
import styles from './LazyLoading.module.sass';

export default function LazyLoading() {
  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.loader)}>
        {/* <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div> */}
        <div className={cn(styles.loader__text)}></div>
      </div>
    </div>
  );
}
