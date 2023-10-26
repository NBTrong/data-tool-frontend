import React from 'react';
import useInstagramNoCORs from '../../../../../../../../../hooks/useInstagramNoCORs';
import cn from 'classnames';
import styles from '../../../../../Row/Row.module.sass';
import ImageEnsure from '../../../../../../../../../components/ImageEnsure';

const Post = ({ post }) => {
  const { image_url: postImageUrl, isSuccess: postImageIsSuccess } =
    useInstagramNoCORs({ imageUrl: post?.thumb });

  return (
    <>
      <a
        href={post?.url}
        target={'_blank'}
        rel={'noreferrer'}
        className={'me-1'}
      >
        <ImageEnsure
          className={cn(
            styles.video_thumb,
            !postImageIsSuccess && 'twinkle rounded-20',
          )}
          src={postImageIsSuccess ? postImageUrl : 'false'}
          srcOnError={'/images/content/instagram.png'}
        />
      </a>
    </>
  );
};

export default Post;
