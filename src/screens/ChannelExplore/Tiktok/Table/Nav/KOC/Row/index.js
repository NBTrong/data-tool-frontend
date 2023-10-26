import React from 'react';

import cn from 'classnames';
import styles from '../../../Row/Row.module.sass';
import {
  handleLongNumber,
  timestampToDate,
} from '../../../../../../../utils/helpers';
import ImageEnsure from '../../../../../../../components/ImageEnsure';

const Row = ({ KOCs }) => {
  return (
    <>
      {KOCs?.map((KOC) => {
        return (
          <div className={cn(styles.row, 'cursor-pointer')}>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <a
                href={'https://tiktok.com/@' + KOC?.author?.unique_id}
                className={'d-flex align-items-center'}
                target={'_blank'}
                rel={'noreferrer'}
              >
                <div className={'me-2'}>
                  <ImageEnsure
                    className={styles.author_avatar}
                    src={KOC?.author?.avatar_url}
                    alt={KOC?.author?.unique_id}
                  />
                </div>
                <div className={'lh-sm'}>
                  <div className={'text-black'}>{KOC?.author?.name}</div>
                  <div className={cn(styles.text_gray)}>
                    @{KOC?.author?.unique_id}
                  </div>
                </div>
              </a>
            </div>
            <div
              className={cn(
                styles.col,
                'p-3 border-0 d-flex align-items-center',
              )}
            >
              {KOC?.videos.slice(0, 4).map((video) => {
                return (
                  <>
                    <a href={video?.url} target={'_blank'} rel={'noreferrer'}>
                      <img
                        className={cn(styles.video_thumb, styles.small, 'me-2')}
                        src={video?.thumb}
                        alt={KOC?.author?.name}
                      />
                    </a>
                  </>
                );
              })}
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>{(KOC?.videos).length}</div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>
                {handleLongNumber(KOC?.author?.follower_count)}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>
                {handleLongNumber(KOC?.total_views)}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>
                {handleLongNumber(KOC?.total_likes)}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={cn(styles.text_gray)}>
                {timestampToDate(KOC?.latest_content)}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Row;
