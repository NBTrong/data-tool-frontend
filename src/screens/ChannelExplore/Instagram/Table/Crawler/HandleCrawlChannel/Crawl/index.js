import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { DataCrawledContext } from '../../../../index';
import useChannelExploreInstagram from '../../../../../../../hooks/useChannelExploreInstagram';
import useChannelInfoInstagram from '../../../../../../../hooks/useChannelInfoInstagram';
import { toast } from 'react-toastify';

const maxRefresh = 4;

const Handle = ({
  keyword,
  addNewPage,
  handleSetCountSuccess,
  cursor,
  setNoMoreCursor,
}) => {
  const { dataCrawled, setDataCrawled } = useContext(DataCrawledContext);
  const [isSavePostCrawled, setIsSavePostCrawled] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [refreshUser, setRefreshUser] = useState(0);
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

  const getUsernameFromInstagramURLs = (url) => {
    const usernameRegex = /instagram\.com\/([A-Za-z0-9._]+)/;
    const match = url.match(usernameRegex);
    if (match && match.length > 1) {
      return match[1];
    } else {
      return url;
    }
  };

  const {
    posts,
    endCursor,
    isSuccess: isGetUserPostsSuccess,
    isError: isGetUserPostsError,
  } = useChannelExploreInstagram({
    user_name: getUsernameFromInstagramURLs(keyword),
    end_cursor: cursor,
    refresh
  });

  const {
    user,
    isSuccess: isGetUserInfoSuccess,
  } = useChannelInfoInstagram({
    user_name: getUsernameFromInstagramURLs(keyword),
    refresh: refreshUser,
  });

  useEffect(()=>{
    if (isGetUserPostsSuccess && !posts && refresh < maxRefresh){
      setRefresh(refresh + 1)
    }
  },[isGetUserPostsSuccess,posts,refresh])

  useEffect(()=>{
    if (isGetUserInfoSuccess && !user && refreshUser < maxRefresh){
      setRefreshUser(refreshUser + 1)
    }
  },[isGetUserInfoSuccess,user,refreshUser])

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
    if (!isSaveUserCrawled && isGetUserInfoSuccess) {
      setIsSaveUserCrawled(1);
      user.keyword = keyword;
      handlePushDataCrawled({
        postsNewData: [],
        KOCsNewData: user,
      });
    }
  }, [isSaveUserCrawled, user, isGetUserInfoSuccess]);

  useEffect(() => {
    if (endCursor) {
      addNewPage(endCursor);
    }
    if (isGetUserPostsSuccess && !endCursor) {
      setNoMoreCursor(1);
    }
  }, [isGetUserPostsSuccess, endCursor, posts]);

  useEffect(() => {
    if (isGetUserPostsSuccess && !posts && cursor === null) {
      toast.error('Cannot find channel: ' + keyword);
    }
  }, [isGetUserPostsSuccess, posts]);

  return <></>;
};

export default Handle;
