import { useCallback } from 'react';
import useQueryString from './useQueryString';
import { useQuery } from '@tanstack/react-query';
import {getTiktokPostComments, getTiktokUserInfo} from '../services/api';

export default function useTiktokPostComments({ aweme_id, cursor, refresh,active,index }) {
  const parseData = useCallback((data) => {
    const comments = data?.comments?.map((comment)=>({
      like_count: comment?.digg_count,
      aweme_id: comment?.aweme_id,
      cid: comment?.cid,
      create_time: comment?.create_time,
      text: comment?.text,
      no_more_replies: false,
      reply_comment_total: comment?.reply_comment_total,
      replies: [],
      index,
      user: {
        unique_id: comment?.user?.unique_id,
        url: "https://tiktok.com/@"+comment?.user?.unique_id,
        nickname: comment?.user?.nickname,
        avatar_thumb: comment?.user?.avatar_thumb?.url_list[0] || comment?.user?.cover_url[0].url_list[0],
      }
    })) || data?.comments;

    return {comments,hasMore: data?.hasMore}
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['TiktokUserPostComments', aweme_id, cursor, refresh],
    queryFn: () => getTiktokPostComments({ aweme_id, cursor, refresh }),
    staleTime: Infinity,
    select: (data) => parseData(data.data.data),
    enabled: !!aweme_id && !!active,
    onSuccess: (data) => {},
    retry: 2,
  });

  return {
    comments: data?.comments,
    hasMore: data?.hasMore,
    isSuccess,
    isLoading,
  };
}
