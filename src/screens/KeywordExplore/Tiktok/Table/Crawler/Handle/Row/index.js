import React from 'react';
import { Container, Row as Brow, Col } from 'react-bootstrap';
import cn from 'classnames';
import style from '../../../Table.module.sass';
import { useContext } from 'react';
import { DataCrawledContext } from '../../../../index';
import {
  handleLongNumber,
  timestampToDate,
} from '../../../../../../../utils/helpers';

const RowTable = ({ data }) => {
  const addObjectIfNotExists = (array, object) => {
    const valid = !array.some(
      (item) => JSON.stringify(item) === JSON.stringify(object),
    );
    if (valid) {
      array.push(object);
    }
  };
  const arrCrawled = useContext(DataCrawledContext);
  addObjectIfNotExists(arrCrawled, data);

  return (
    <>
      <Brow className={'py-2 my-1 border-bottom flex-nowrap'}>
        <Col
          className={cn(
            'd-flex justify-content-start align-items-center pe-0',
            style.col_image,
          )}
        >
          <img
            className={'w-100'}
            style={{ height: 'auto', borderRadius: '5px' }}
            src={data.thumb_url}
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
            <a href={data.url}>
              <p style={{ wordWrap: 'break-word', maxWidth: '90%' }}>
                {data.url}
              </p>
            </a>
          </div>
        </Col>
        <Col
          className={cn(
            'd-flex justify-content-start align-items-center col-3 fw-normal text-secondary overflow-hidden',
            style.col_min_width_md,
          )}
        >
          {data.title}
        </Col>
        <Col
          className={cn(
            'd-flex justify-content-start align-items-center col fw-normal text-secondary',
            style.col_min_width,
          )}
        >
          {data.platform}
        </Col>
        <Col
          className={cn(
            'd-flex justify-content-start align-items-center col',
            style.col_min_width,
          )}
          style={{ minWidth: '90px' }}
        >
          <span className={'status-default fw-bold'}>
            {handleLongNumber(data.statistics.view_count)}
          </span>
        </Col>
        <Col
          className={cn('d-flex justify-content-start align-items-center col')}
          style={{ minWidth: '90px' }}
        >
          <span className={'status-default fw-bold'}>
            {handleLongNumber(data.statistics.like_count)}
          </span>
        </Col>
        <Col
          className={cn('d-flex justify-content-start align-items-center col')}
          style={{ minWidth: '90px' }}
        >
          <span className={cn('status-default fw-bold')}>
            {handleLongNumber(
              data.statistics.share_count ? data.statistics.share_count : '--',
            )}
          </span>
        </Col>
        <Col
          className={'d-flex justify-content-start align-items-center col'}
          style={{ minWidth: '90px' }}
        >
          <span className={cn('status-default fw-bold')}>
            {handleLongNumber(data.statistics.comment_count)}
          </span>
        </Col>
        <Col
          className={'d-flex justify-content-start align-items-center col'}
          style={{ minWidth: '90px' }}
        >
          <span className={cn('status-default fw-bold')}>
            {handleLongNumber(
              data.statistics.save_count ? data.statistics.save_count : '--',
            )}
          </span>
        </Col>
        <Col
          className={cn(
            'd-flex justify-content-start align-items-center col text-secondary',
            style.col_min_width,
          )}
        >
          {timestampToDate(data.created_at)}
        </Col>
      </Brow>
    </>
  );
};

export default RowTable;
