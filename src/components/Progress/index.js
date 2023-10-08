import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './Progress.module.sass';

const Progress = ({
  style,
  className,
  percent,
  classNameParent = '',
  isShowPercent = false,
}) => {
  const [styleProgress, setStyleProgress] = useState();
  useEffect(() => {
    setStyleProgress({
      opacity: !!percent + 0,
      width: `${percent}%`,
    });
  }, [percent]);
  return (
    <div className={cn(classNameParent ?? 'd-flex justify-content-center')}>
      <div
        className={cn(styles.progress, className, 'position-relative')}
        style={style}
      >
        <div className={styles.progress_done} style={styleProgress}></div>
        <div
          className={
            'position-absolute centered-axis-x text-white fw-bold text-shadow-gray'
          }
          style={{ fontSize: '11px', top: '-3px' }}
        >
          {isShowPercent && percent + '%'}
        </div>
      </div>
    </div>
  );
};

export default Progress;
