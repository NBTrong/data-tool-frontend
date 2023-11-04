import { useCallback, useMemo, useEffect } from 'react';
import useQueryString from './useQueryString';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTiktokPostsByKeyword } from '../services/api';

export default function useKeywordExploreTiktok({ keyword, offset }) {
  const queryClient = useQueryClient();

  const defaultQueryString = useMemo(() => {
    return {
      keyword: null,
      offset: null,
      sort_type: null,
      publish_time: null,
    };
  }, []);

  const { queryString, setQueryString } = useQueryString({ keyword, offset });

  const {sort_type,publish_time} = queryString;

  const parseData = useCallback((data) => {
    const posts = data?.aweme_list
      .map((item) => {
        return {
          ...item,
          offset,
          keyword
        };
      });

    const hasMore = data?.has_more;
    const cursor = data?.cursor;
    return { posts, hasMore,cursor };
  }, [offset,keyword]);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['keywordsExplore', keyword, offset,sort_type,publish_time],
    queryFn: () => getTiktokPostsByKeyword(queryString),
    staleTime: 0,
    select: (data) => parseData(data.data.data),
    enabled: !!keyword && !!offset,
    onSuccess: (data) => {},
    retry: 2,
  });

  const handlePageChange = useCallback(
    ({ selected }) => {
      setQueryString({ ...queryString });
    },
    [queryString, setQueryString],
  );

  useEffect(() => {
    if (!keyword || !offset) {
      setQueryString(defaultQueryString);
    }
  }, [defaultQueryString, queryString, setQueryString]);

  return {
    posts: data?.posts,
    isSuccess,
    hasMore: data?.hasMore,
    isLoading,
    totalPage: queryClient.getQueryData(['totalPageCampaigns']),
    handlePageChange,
  };
}
