import React from 'react';

import cn from 'classnames';
import styles from '../../../../Row/Row.module.sass';
import {
  handleLongNumber,
  timestampToDate,
} from '../../../../../../../../utils/helpers';
import ImageEnsure from '../../../../../../../../components/ImageEnsure';
import useInstagramNoCORs from '../../../../../../../../hooks/useInstagramNoCORs';
import Post from './Post';

const HandleImage = ({ KOC }) => {
  const { image_url: avatarImageUrl, isSuccess: avatarImageIsSuccess } =
    useInstagramNoCORs({ imageUrl: KOC?.author?.avatar_url });
  return (
    <>
      <div className={cn(styles.row, 'cursor-pointer')}>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={'d-flex align-items-center'}>
            <a
              className={'me-2'}
              href={'https://tiktok.com/@' + KOC?.author?.unique_id}
              target={'_blank'}
              rel={'noreferrer'}
            >
              <ImageEnsure
                className={styles.author_avatar}
                src={avatarImageIsSuccess ? avatarImageUrl : 'false'}
                srcOnError={'/images/content/instagram.png'}
                alt={KOC?.author?.unique_id}
              />
            </a>
            <div className={'lh-sm'}>
              <div className={'text-black'}>{KOC?.author?.name}</div>
              <div className={cn(styles.text_gray)}>
                @{KOC?.author?.unique_id}
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(styles.col, 'p-3 border-0 d-flex align-items-center')}
        >
          {KOC?.posts.slice(0, 4).map((post) => {
            return (
              <>
                <Post post={post} />
              </>
            );
          })}
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={'status-default'}>{(KOC?.posts).length}</div>
        </div>
        {/*<div className={cn(styles.col, 'p-3 border-0')}>*/}
        {/*    <div className={'status-default'}>*/}
        {/*        {handleLongNumber(KOC?.total_views)}*/}
        {/*    </div>*/}
        {/*</div>*/}
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={'status-default'}>
            {handleLongNumber(KOC?.total_likes)}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={'status-default'}>
            {handleLongNumber(KOC?.total_comments)}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={cn(styles.text_gray)}>
            {timestampToDate(KOC?.latest_content)}
          </div>
        </div>
      </div>
    </>
  );
};

export default HandleImage;
