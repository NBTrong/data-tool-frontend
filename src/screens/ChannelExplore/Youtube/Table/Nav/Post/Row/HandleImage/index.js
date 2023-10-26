import React, { useEffect, useState, useContext } from 'react';

import cn from 'classnames';
import styles from '../../../../Row/Row.module.sass';
import {
  handleLongNumber,
  timestampToDate,
} from '../../../../../../../../utils/helpers';
import ImageEnsure from '../../../../../../../../components/ImageEnsure';
import useInstagramNoCORs from '../../../../../../../../hooks/useInstagramNoCORs';
import { DataCrawledContext } from '../../../../../index';

const HandleImage = ({ post, timeOut }) => {
  const { dataCrawled, setDataCrawled } = useContext(DataCrawledContext);
  const [isShowImage, setIsShowImage] = useState(1);

  const { image_url: postImageUrl, isSuccess: postImageIsSuccess } =
    useInstagramNoCORs({ imageUrl: post?.post?.thumb });
  const { image_url: avatarImageUrl, isSuccess: avatarImageIsSuccess } =
    useInstagramNoCORs({ imageUrl: post?.author?.avatar_url });

  setTimeout(function () {
    setIsShowImage(1);
  }, timeOut);

  return (
    <>
      <div className={cn(styles.row, 'cursor-pointer')}>
        <div
          className={cn(styles.col, 'p-3 border-0 d-flex align-items-center')}
        >
          <a
            href={post?.post?.url}
            target={'_blank'}
            rel={'noreferrer'}
            title={
              isShowImage &&
              postImageIsSuccess &&
              postImageUrl.includes('undefined')
                ? 'This post image cannot be displayed'
                : ''
            }
          >
            <ImageEnsure
              className={cn(
                styles.video_thumb,
                !(isShowImage && postImageIsSuccess) && 'twinkle rounded-20',
              )}
              src={isShowImage && postImageIsSuccess ? postImageUrl : 'false'}
              srcOnError={'/images/content/instagram.png'}
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
          <div className={'d-flex align-items-center'}>
            <a
              href={`https://instagram.com/${post?.author?.unique_id}`}
              target={'_blank'}
              rel={'noreferrer'}
              className={'me-2 cursor-pointer'}
            >
              <ImageEnsure
                className={cn(
                  styles.author_avatar,
                  !(isShowImage && avatarImageIsSuccess) && 'twinkle',
                )}
                src={
                  isShowImage && avatarImageIsSuccess ? avatarImageUrl : 'false'
                }
                srcOnError={'/images/content/instagram.png'}
                alt={post?.author?.unique_id}
              />
            </a>
            <div>
              <div className={'text-black'}>{post?.author?.name}</div>
              <div className={cn(styles.text_gray)}>
                @{post?.author?.unique_id}
              </div>
            </div>
          </div>
        </div>
        {/*<div className={cn(styles.col, 'p-3 border-0')}>*/}
        {/*    <div className={'status-default'}>*/}
        {/*        {handleLongNumber(post?.total_views)}*/}
        {/*    </div>*/}
        {/*</div>*/}
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
            {timestampToDate(post?.created_at, 'date')}
          </div>
        </div>
      </div>
    </>
  );
};

export default HandleImage;
