import { useCallback, useMemo, useEffect } from 'react';
import useQueryString from './useQueryString';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTiktokUserPosts } from '../services/api';

export default function useKeywordExplore({ search, maxCursor, rand,count='100' }) {
  const queryClient = useQueryClient();
  const defaultQueryString = useMemo(() => {
    return {
      search: null,
      maxCursor: null,
    };
  }, []);

  const { queryString } = useQueryString({
    search,
    maxCursor,
    rand,
    count
  });

  const parseData = useCallback((data) => {
    const posts = data.aweme_list;
    const nextCursor = data?.has_more ? data?.next_page : null;
    return { posts, nextCursor };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['channelsExplore', search, maxCursor, rand,count],
    queryFn: () => getTiktokUserPosts(queryString),
    staleTime: 0,
    select: (data) => parseData(data.data.data),
    enabled: !!search && maxCursor !== undefined,
    retry: 2,
  });


  return {
    posts: data?.posts,
    nextCursor: data?.nextCursor,
    isSuccess,
    isLoading,
    totalPage: queryClient.getQueryData(['totalPageCampaigns']),
  };
}
