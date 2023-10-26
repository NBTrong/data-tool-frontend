import React, {
  useState,
  useContext,
  useEffect,
} from 'react';
import useChannelExplore from '../../../../../../../hooks/useChannelExploreTiktok';
import { DataCrawledContext } from '../../../../index';
import {TableContext} from "../../../index";

const Handle = ({ keyword,uid, maxCursor, addNewCursor, setIsSuccess,itemUpdate }) => {
  const [tryAgain, setTryAgain] = useState(0);
  const {handleUpdateOverlookLists} = useContext(TableContext);
  const { dataCrawled, setDataCrawled } = useContext(DataCrawledContext);
  const [isSaveDataCrawled, setIsSaveDataCrawled] = useState(false);

  const { posts, nextCursor, isSuccess, isLoading } = useChannelExplore({
    search: uid || false,
    maxCursor: maxCursor,
    rand: tryAgain,
    count: '35'
  });

  const formatTimestamp13Words = (time) => {
    return time * Math.pow(10,13 - String(time).length)
  }

  useEffect(() => {
    if (nextCursor && isSuccess && posts) {
      addNewCursor(nextCursor);
    }
    if (isSuccess && !nextCursor && posts && posts.length) {
      setIsSuccess(1);
    }
    if (isSuccess && tryAgain < 2 && !posts) {
      setTryAgain(tryAgain + 1);
    }
  }, [isSuccess, nextCursor, isLoading, posts, tryAgain]);

  const handlePushDataCrawled = (newData) => {
    setDataCrawled(() => dataCrawled.concat(newData));
  };

  useEffect(() => {
    if (!isSaveDataCrawled && isSuccess && posts) {
      setIsSaveDataCrawled(true);
      const updateClone = itemUpdate;
      updateClone.posts_plush = (!isSaveDataCrawled && isSuccess) ? posts?.length : 0;
      updateClone.maxCursor = maxCursor;
      if (!nextCursor){
        updateClone.status = "finished";
      }
      handleUpdateOverlookLists(updateClone)
      handlePushDataCrawled(
        posts?.map((i) => {
          i.keyword = keyword;
          return i;
        }),
      );
    }
  }, [isSaveDataCrawled, posts, isSuccess, handleUpdateOverlookLists, handlePushDataCrawled,keyword,itemUpdate,nextCursor]);

  return <></>;
};

export default Handle;
