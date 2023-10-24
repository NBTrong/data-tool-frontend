import { React, useEffect, useState, useContext, useMemo } from 'react';
import useCrawlData from '../../../../../hooks/useCrawlData';
import { DataCrawledContext } from "../../../index";
import HandleComments from "./HandleComments";
import { getPostId } from "../../../../../utils/helpers";
import { TableContext } from "../../index";

const maxRefresh = 3;

const Handle = ({ item, timeout, language_code, index }) => {
  const { handlePushDataCrawled, DEFAULT_NOTFOUND } = useContext(DataCrawledContext);
  const { handleSetTotalCommentCount } = useContext(TableContext);
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
      handlePushDataCrawled(crawlData, index)
      handleSetTotalCommentCount(parseInt(crawlData?.statistics?.comment_count || 0, 10))
    } else {
      if (refresh >= maxRefresh && isActive) {
        setIsActive(false)
        handlePushDataCrawled({
          ...crawlData,
          ...DEFAULT_NOTFOUND
        }, index)
      }
    }
    if (isError && isActive) {
      setIsActive(false)
      handlePushDataCrawled({
        ...crawlData,
        ...DEFAULT_NOTFOUND
      }, index)
    }
  }, [crawlData, isActive, isSuccess, handleSetTotalCommentCount])

  return (
    <>
      {(item?.platform === "tiktok" && isSuccess) && <HandleComments url={item?.url} aweme_id={getPostId(item?.url)} timeout={timeout * 2} index={index} />}
    </>
  );
};

export default Handle;
