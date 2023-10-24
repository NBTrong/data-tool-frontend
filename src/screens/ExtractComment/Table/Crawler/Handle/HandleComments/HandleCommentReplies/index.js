import {React, useEffect, useState, useContext, useMemo} from 'react';
import {DataCrawledContext} from "../../../../../index";
import useTiktokPostCommentReplies from "../../../../../../../hooks/useTiktokPostCommentReplies";
import {TableContext} from "../../../../index";

const maxRefresh = 4;

const HandleCommentReplies = ({aweme_id,comment_id,timeout,indexPost,indexComment,post_url }) => {
  const [cursor,setCursor] = useState(0);
  const [refresh,setRefresh] = useState(0);
  const [isActiveGetComments,setIsActiveGetComments] = useState(false);
  const { handleSetCommentReplies,cursorCommentPlush,activeCrawlComment } = useContext(DataCrawledContext);
  const { handleSetTotalCommentCrawled } = useContext(TableContext);

  useEffect(()=>{
    setTimeout(()=>{
      setIsActiveGetComments(true)
    },timeout)
  },[])

  const activeAll = useMemo(()=>{
    return activeCrawlComment[post_url] !== false && isActiveGetComments
  },[activeCrawlComment,isActiveGetComments])

  const {
    replies, isSuccess,hasMore
  } = useTiktokPostCommentReplies({aweme_id, comment_id,cursor,refresh,active: activeAll});

  useEffect(()=>{
    if (isSuccess && isActiveGetComments && replies !== undefined){
      setIsActiveGetComments(false);
      handleSetCommentReplies({replies,indexPost,indexComment,noMore: hasMore})
      handleSetTotalCommentCrawled(replies?.length || 0)
    }
  },[isSuccess,replies,indexPost,indexComment,isActiveGetComments,hasMore])

  //check havemore
  useEffect(()=>{
    if (isSuccess && replies && hasMore){
      const newCursor = cursor + cursorCommentPlush;
      setIsActiveGetComments(true)
      setCursor(newCursor)
    }

  },[isSuccess,replies,cursor])

  //check api error
  useEffect(()=>{
    if (isSuccess && replies === undefined && refresh < maxRefresh){
      setRefresh(refresh + 1)
    }
  },[isSuccess,replies,refresh,cursor])

  //max refresh and no result
  useEffect(()=>{
    if (refresh === maxRefresh && !replies?.length){
      handleSetCommentReplies({replies: [],indexPost,indexComment,noMore: true})
    }
  },[refresh,replies])

  return (
      <>
      </>
  );
};

export default HandleCommentReplies;
