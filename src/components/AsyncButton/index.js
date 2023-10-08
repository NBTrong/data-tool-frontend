import React from 'react';
import cn from 'classnames';
import styles from './AsyncButton.module.sass';
import { ThreeDots } from 'react-loader-spinner';

function AsyncButton({ loading, value, ...others }) {
  return (
    <>
      <button className={cn('button', styles.button)} {...others}>
        {loading ? (
          <ThreeDots width="40" height="20" radius="10" />
        ) : (
          <span>{value}</span>
        )}
      </button>
    </>
  );
}

export default AsyncButton;
