import React from 'react';
import { Row as Brow, Col } from 'react-bootstrap';
import cn from 'classnames';
import style from '../../../../Table.module.sass';
import { useContext } from 'react';
import { DataCrawledContext } from '../../../../../index';

const RowError = ({ data }) => {
  const errorData = data;
  errorData.title = 'This post could not be found';
  const arrCrawled = useContext(DataCrawledContext);
  arrCrawled.push(errorData);

  return (
    <>
      <Brow className={'py-2 my-1 border-bottom flex-nowrap'}>
        <Col
          className={cn(
            'd-flex justify-content-center align-items-center pe-0',
            style.col_image,
          )}
        >
          <img
            style={{
              height: 'auto',
              borderRadius: '5px',
              width: '100%',
              opacity: 0.5,
            }}
            src="/images/content/playbutton.png"
            alt=""
          />
        </Col>
        <Col
          className={cn(
            'ps-4 col-3 d-flex align-items-center',
            style.col_min_width_md,
          )}
        >
          <div style={{ maxWidth: '100%' }}>
            <a href={errorData.link}>
              <p style={{ wordWrap: 'break-word', maxWidth: '90%' }}>
                {errorData.link}
              </p>
            </a>
          </div>
        </Col>
        <Col
          className={cn(
            'd-flex justify-content-start align-items-center col-3 fw-normal text-secondary overflow-hidden text-danger',
            style.col_min_width_md,
          )}
        >
          {errorData.title}
        </Col>
      </Brow>
    </>
  );
};

export default RowError;
