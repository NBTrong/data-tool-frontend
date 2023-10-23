import { React, useEffect, useState, useContext, useMemo } from 'react';
import useCrawlData from '../../../../../hooks/useCrawlData';
import { DataCrawledContext } from "../../../index";

const maxRefresh = 3;

const Handle = ({ item, timeout, language_code }) => {
  const { handlePushDataCrawled, activeDetectVoice } = useContext(DataCrawledContext);
  const [isActive, setIsActive] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [post, setPost] = useState({});

  useEffect(() => {
    setTimeout(function () {
      setIsActive(true)
    }, timeout)
  }, [item])

  const { crawlData, isSuccess, isError } = useCrawlData(
    { platform: item.platform ?? 'Unknown', url: item.url, isActive, refresh }
  );

  useEffect(() => {
    if (refresh < maxRefresh && isSuccess && crawlData?.failed) {
      setRefresh(refresh + 1)
    }
  }, [isSuccess, crawlData, refresh])

  useEffect(() => {
    if (crawlData && isSuccess && isActive && !crawlData.failed) {
      setIsActive(false)
      setPost(crawlData)
      handlePushDataCrawled(crawlData)
    } else {
      if (refresh >= maxRefresh && isActive) {
        setIsActive(false)
        handlePushDataCrawled({
          ...crawlData,
          title: "Can't find this post"
        })
      }
    }
    if (isError && isActive) {
      setIsActive(false)
      handlePushDataCrawled({
        ...crawlData,
        title: "Can't find this post"
      })
    }
  }, [crawlData, isActive, isSuccess])

  return <></>
};

export default Handle;
