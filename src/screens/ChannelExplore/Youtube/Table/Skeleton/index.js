import React from 'react';
import cn from 'classnames';
import styles from '../Row/Row.module.sass';
import Skeleton from 'react-loading-skeleton';

export default function SkeletonTable({ limit = 5 }) {
  return (
    <>
      {Array(parseInt(limit))
        .fill(0)
        .map((_, index) => {
          return (
            <div className={cn(styles.row)} key={index}>
              <div className={cn(styles.col)}>
                <Skeleton
                  count={1}
                  height={100}
                  width={'94%'}
                  className={'ms-3'}
                />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'98%'} />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'95%'} />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'95%'} />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'95%'} />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'95%'} />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'95%'} />
              </div>
              <div className={cn(styles.col)}>
                <Skeleton count={1} height={100} width={'95%'} />
              </div>
            </div>
          );
        })}
    </>
  );
}
