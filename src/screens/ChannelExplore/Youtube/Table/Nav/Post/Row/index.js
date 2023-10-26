import React from 'react';

import cn from 'classnames';
import styles from '../../../Row/Row.module.sass';
import {
  convertToDateFormat,
  handleLongNumber,
  stringToTimestamp,
  timestampToDate,
} from '../../../../../../../utils/helpers';
import ImageEnsure from '../../../../../../../components/ImageEnsure';

const Row = ({ posts }) => {
  return (
    <>
      {posts?.map((post) => {
        return (
          <div className={cn(styles.row, 'cursor-pointer')}>
            <div
              className={cn(
                styles.col,
                'p-3 border-0 d-flex align-items-center',
              )}
            >
              <a href={post?.video?.url} target={'_blank'} rel={'noreferrer'}>
                <ImageEnsure
                  className={styles.video_thumb}
                  src={post?.video.thumb}
                  alt={post?.name}
                />
              </a>
              <div
                className={cn(
                  'ms-2',
                  styles.video_name,
                  styles.text_gray,
                  'word-wrap',
                )}
              >
                {post?.name}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <a
                href={`https://tiktok.com/@${post?.author?.unique_id}`}
                target={'_blank'}
                rel={'noreferrer'}
                className={'d-flex align-items-center'}
              >
                {/*<div className={'me-2'}>*/}
                {/*  <ImageEnsure*/}
                {/*      className={styles.author_avatar}*/}
                {/*      src={post?.author?.avatar_url}*/}
                {/*      alt={post?.author?.unique_id}*/}
                {/*  />*/}
                {/*</div>*/}
                <div>
                  <div className={'text-black lh-sm'}>{post?.author?.name}</div>
                  {/*<div className={cn(styles.text_gray)}>*/}
                  {/*  @{post?.author?.unique_id}*/}
                  {/*</div>*/}
                </div>
              </a>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>
                {handleLongNumber(post?.total_views)}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>
                {handleLongNumber(post?.total_likes)}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={'status-default'}>
                {handleLongNumber(post?.total_comments)}
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={cn(styles.text_gray)}>
                {convertToDateFormat(post?.created_at)}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Row;
