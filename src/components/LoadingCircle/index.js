import React from 'react';
import cn from 'classnames';
import styles from './LoadingCircle.module.sass';

const LoadingCircle = ({ className, white }) => {
  return (
    <div className={styles.loadingOuter}>
      <div class={styles.center}>
        <div class={styles.circle}>
          <div></div>
        </div>
        <div class={styles.circle}>
          <div></div>
        </div>
        <div class={styles.circle}>
          <div></div>
        </div>
        <div class={styles.circle}>
          <div></div>
        </div>
        <div class={styles.circle}>
          <div></div>
        </div>
        <div class={styles.circle}>
          <div></div>
        </div>
        <div class={styles.circle}>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCircle;
