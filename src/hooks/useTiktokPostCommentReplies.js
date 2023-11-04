import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {getTiktokPostCommentReplies} from '../services/api';

export default function useTiktokPostCommentReplies({ aweme_id,comment_id, cursor, refresh,active=true }) {
  const parseData = useCallback((data) => {
    const replies = data?.comments?.map((comment)=>({
      like_count: comment?.digg_count,
      aweme_id: comment?.aweme_id,
      cid: comment?.cid,
      create_time: comment?.create_time,
      text: comment?.text,
      reply_comment_total: comment?.reply_comment_total,
      user: {
        unique_id: comment?.user?.unique_id,
        url: "https://tiktok.com/@"+comment?.user?.unique_id,
        nickname: comment?.user?.nickname,
        avatar_thumb: comment?.user?.avatar_thumb?.url_list[0] || comment?.user?.cover_url[0].url_list[0],
      }
    }))
    return {replies,hasMore: data?.hasMore}
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['TiktokUserPostComments', aweme_id,comment_id, cursor, refresh],
    queryFn: () => getTiktokPostCommentReplies({ aweme_id,comment_id, cursor, refresh }),
    staleTime: Infinity,
    select: (data) => parseData(data.data.data),
    enabled: !!aweme_id && !!comment_id && !!active,
    onSuccess: (data) => {},
    retry: 2,
  });

  return {
    replies: data?.replies,
    hasMore: data?.hasMore,
    isSuccess,
    isLoading,
  };
}
