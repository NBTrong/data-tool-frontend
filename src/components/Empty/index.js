import React from 'react';
import cn from 'classnames';
import styles from './Empty.module.sass';

const Empty = ({
  title = 'Data is empty',
  description = 'Import excel file to extract data',
  imageSrc = '/images/empty-data.png',
  noMargin = false,
}) => {
  return (
    <>
      <div
        className={'collumn table-sticky-card'}
        style={{ minHeight: '200px' }}
      >
        <div
          className={`d-flex justify-content-center align-items-center w-100 mb-2 ${
            noMargin ? '' : 'mt-5'
          }`}
        >
          <img
            className={cn('mt-3', styles.empty_image)}
            src={imageSrc}
            alt="empty"
          />
        </div>
        <div className={'text-center mt-3'}>
          <div className={'h5'}>{title}</div>
          <div
            className={'fw-light'}
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Empty;
