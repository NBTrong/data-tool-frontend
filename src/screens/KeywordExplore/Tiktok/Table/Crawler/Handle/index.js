import React, { useState, useContext, useEffect } from 'react';
import useKeywordExploreTiktok from '../../../../../../hooks/useKeywordExploreTiktok';
import SkeletonTable from './Skeleton';
import { DataCrawledContext } from '../../../index';
import { toast } from 'react-toastify';

const Handle = ({ keyword, offset }) => {
  const { posts, isSuccess } = useKeywordExploreTiktok({
    keyword,
    offset,
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
      if (offset > 350) {
        toast.success(`Finished explore keyword: "${keyword}"`);
      }
    }
  }, [isSaveDataCrawled, posts, isSuccess, keyword]);

  return <></>;
};

export default Handle;
