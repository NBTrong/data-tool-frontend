import {React, useEffect, useState, useContext, useMemo} from 'react';
import {DataCrawledContext} from "../../../../index";
import useTiktokPostComments from "../../../../../../hooks/useTiktokPostComments";
import {TableContext} from "../../../index";
import HandleCommentReplies from "./HandleCommentReplies";

const HandleComments = ({ url,aweme_id,timeout,index }) => {
  const [cursor,setCursor] = useState(0);
  const [isActiveGetComments,setIsActiveGetComments] = useState(false);
  const { handleSetComments,maxCursor,activeCrawlComment,cursorCommentPlush,dataCrawled } = useContext(DataCrawledContext);
  const { handleSetTotalCommentCrawled } = useContext(TableContext);
  const isActive = useMemo(()=>{
    return (isActiveGetComments && activeCrawlComment[url] && cursor < maxCursor) || activeCrawlComment[url] === Infinity;
  },[isActiveGetComments,activeCrawlComment,cursor,maxCursor])

  useEffect(()=>{
    setTimeout(()=>{
      setIsActiveGetComments(true)
    },timeout)
  },[timeout,cursor])

  const {
    comments, isSuccess,hasMore
  } = useTiktokPostComments({aweme_id, cursor,active: isActive,index});

  useEffect(()=>{
    if (isSuccess && isActiveGetComments && comments !== undefined){
      setIsActiveGetComments(false);
      const isNull = !hasMore && isSuccess && comments === null;
      handleSetComments(url?.trim(), comments,index,isNull,hasMore);
      handleSetTotalCommentCrawled(comments?.length || 0)
    }
  },[isSuccess,comments,hasMore,handleSetTotalCommentCrawled])

  //check havemore
  useEffect(()=>{
    if (isSuccess && comments && hasMore && isActive){
      const newCursor = cursor + cursorCommentPlush;
      setCursor(newCursor)
    }
  },[isSuccess,comments,isActive,cursor,activeCrawlComment])

  let commentHaveReplyCount = 0;

  return (
      <>
        {!!dataCrawled[index]?.comments?.length
            && dataCrawled[index]?.comments?.map((comment,indexComment)=>{
          if (comment?.reply_comment_total > 0){
            commentHaveReplyCount += 1
            return (
                <HandleCommentReplies indexPost={index} indexComment={indexComment} comment_id={comment?.cid} aweme_id={aweme_id} timeout={commentHaveReplyCount * 2000} post_url={url}/>
            )
          }
        })}
      </>
  );
};

export default HandleComments;
