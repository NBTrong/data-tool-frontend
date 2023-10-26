import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { DataCrawledContext } from '../../../../index';
import useChannelExploreYoutube from '../../../../../../../hooks/useChannelExploreYoutube';
import { isValidHttpUrl } from '../../../../../../../utils/helpers';

const Handle = ({
  keyword,
  addNewPage,
  page,
  handleSetCountSuccess,
  setNoMoreCursor,
}) => {
  const { dataCrawled, setDataCrawled } = useContext(DataCrawledContext);
  const [isSavePostCrawled, setIsSavePostCrawled] = useState(0);
  const [isSaveUserCrawled, setIsSaveUserCrawled] = useState(0);

  const handlePushDataCrawled = useCallback(
    ({ postsNewData = [], KOCsNewData = [] }) => {
      setDataCrawled({
        post: dataCrawled.post.concat(postsNewData),
        KOC: dataCrawled.KOC.concat(KOCsNewData),
      });
    },
    [dataCrawled],
  );

  const isYoutubeUrl = useCallback((url) => {
    return isValidHttpUrl(url) && url.includes('youtube.com');
  }, []);

  const channelUrl = useMemo(() => {
    const un = isYoutubeUrl(keyword)
      ? keyword
      : 'https://youtube.com/' + keyword;
    return un;
  }, [keyword]);

  const {
    posts,
    endCursor,
    isSuccess: isGetUserPostsSuccess,
    isError: isGetUserPostsError,
  } = useChannelExploreYoutube({
    channelId: channelUrl,
    page: page,
  });

  useEffect(() => {
    if (!isSavePostCrawled && isGetUserPostsSuccess) {
      setIsSavePostCrawled(1);
      handlePushDataCrawled({
        postsNewData: posts?.map((i) => {
          i.keyword = keyword;
          return i;
        }),
        KOCsNewData: [],
      });
      handleSetCountSuccess();
      if (posts && posts.length) {
        addNewPage(page + 1);
      }
    }
    if (!isSavePostCrawled && isGetUserPostsError) {
      handleSetCountSuccess();
    }
  }, [
    isSavePostCrawled,
    posts,
    setDataCrawled,
    isGetUserPostsSuccess,
    isGetUserPostsError,
  ]);

  useEffect(() => {
    if (isGetUserPostsSuccess && (!posts || (posts && !posts.length))) {
      setNoMoreCursor(1);
    }
  }, [isGetUserPostsSuccess, endCursor, posts]);

  return <></>;
};

export default Handle;
