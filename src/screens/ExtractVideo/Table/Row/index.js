import React from 'react';
import { Row as Brow, Col } from 'react-bootstrap';

import cn from 'classnames';
import styles from './Row.module.sass';

const handleLongNumber = (number) => {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number > 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number;
};

const Row = ({ item, setVisibleModalPreview, setCurrentContent }) => {
  return (
    <>
      <Brow
        className={cn(
          'border-bottom border-secondary-subtle',
          styles.border_bottom_color,
        )}
      >
        <Col xs={5} className={cn(styles.user_col)}>
          <div
            className={styles.item}
            onClick={() => {
              setVisibleModalPreview(true);
              setCurrentContent(item);
              // redirect to tiktoker profile
              window.open(item.shareUrl, '_blank');
            }}
          >
            <div className={styles.avatar}>
              <img src={item.coverUrl} alt="Avatar" />
            </div>
            <div className={styles.details}>
              <div className={styles.user}>{item.description}</div>

              <div className={styles.phoneNumber}>{item.authorNickname}</div>
              <div className={styles.phoneNumber}>{item.createTime}</div>
            </div>
          </div>
        </Col>

        <Col className="d-flex justify-content-start align-items-center">
          <div className={cn('status-default')}>
            {handleLongNumber(item.playCount)}
          </div>
        </Col>
        <Col className="d-flex justify-content-start align-items-center">
          <div className={cn('status-default')}>
            {handleLongNumber(item.diggCount)}
          </div>
        </Col>

        <Col className="d-flex justify-content-start align-items-center">
          <div className={cn('status-default')}>
            {handleLongNumber(item.commentCount)}
          </div>
        </Col>
        <Col className="d-flex justify-content-start align-items-center">
          <div className={cn('status-default')}>
            {handleLongNumber(item.shareCount)}
          </div>
        </Col>
      </Brow>
    </>
  );
};

export default Row;
