import { useCallback, useMemo, useEffect } from 'react';
import useQueryString from './useQueryString';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPostsByKeyword, getPostsByKeywordRapidApi } from '../services/api';

export default function useKeywordExploreTiktokRapidApi({ cid, cursor }) {
  const queryClient = useQueryClient();
  const defaultQueryString = useMemo(() => {
    return {
      cid: null,
      cursor: null,
    };
  }, []);

  const { queryString, setQueryString } = useQueryString({ cid, cursor });

  const parseData = useCallback((data) => {
    const posts = data?.aweme_list?.map((item) => {
      return {
        ...item,
        offset: cursor,
      };
    });
  
    const success = data?.cursor;
    return { posts, hasMore: data?.has_more, success };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['keywordsExplore', cid, cursor],
    queryFn: () => getPostsByKeywordRapidApi(queryString),
    staleTime: 36000 * 1000,
    select: (data) => parseData(data.data.data),
    enabled: !!cid && !!cursor,
    onSuccess: (data) => {},
  });

  const handlePageChange = useCallback(
    ({ selected }) => {
      setQueryString({ ...queryString });
    },
    [queryString, setQueryString],
  );

  // useEffect(() => {
  //   if (!cid || !cursor) {
  //     setQueryString(defaultQueryString);
  //   }
  // }, [defaultQueryString, queryString, setQueryString]);

  return {
    posts: data?.posts,
    hasMore: data?.hasMore,
    isSuccess: isSuccess && data?.success,
    isLoading,
    totalPage: queryClient.getQueryData(['totalPageCampaigns']),
    handlePageChange,
  };
}
