import React, { useState, useContext, useEffect } from 'react';
import { DataCrawledContext } from '../../../../index';
import { toast } from 'react-toastify';
import useKeywordExploreTiktokRapidApi from '../../../../../../../hooks/useKeywordExploreTiktokRapidApi';
import useTiktokHashtagId from '../../../../../../../hooks/useTiktokHashtagId';
import { removeSpaces } from '../../../../../../../utils/helpers';

const HandleHashtag = ({
  keyword,
  offset,
  offsetEnd = 200,
  setKeywordExploredAllPosts,
}) => {
  const { cid, isSuccess: isGetHashtagSuccess } = useTiktokHashtagId({
    hashtag: removeSpaces(keyword).replace('#', ''),
  });

  const { posts, isSuccess, hasMore } = useKeywordExploreTiktokRapidApi({
    cid,
    cursor: offset,
  });

  const { dataCrawled, setDataCrawled } = useContext(DataCrawledContext);
  const [isSaveDataCrawled, setIsSaveDataCrawled] = useState(0);
  const handlePushDataCrawled = (newData) => {
    setDataCrawled(() => dataCrawled.concat(newData));
  };

  useEffect(() => {
    if (!isSaveDataCrawled && isSuccess) {
      handlePushDataCrawled(
        posts?.map((i) => {
          i.keyword = keyword;
          return i;
        }),
      );
      setIsSaveDataCrawled(1);
      if (offset >= offsetEnd) {
        toast.success(`Finished explore keyword: "${keyword}"`);
      }
    }
    if (isSuccess && !hasMore && (!posts || (posts && !posts.length))) {
      setKeywordExploredAllPosts(keyword);
    }
  }, [isSaveDataCrawled, posts, isSuccess, keyword, hasMore]);

  return <></>;
};

export default HandleHashtag;
