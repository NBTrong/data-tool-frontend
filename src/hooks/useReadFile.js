import { useCallback, useMemo, useEffect } from 'react';
import useQueryString from './useQueryString';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getListModels,
  getModel,
  getSearchKeywordSuggestions,
  readFileUrl,
} from '../services/api';

export default function useReadFile({ url }) {
  const queryClient = useQueryClient();
  const defaultQueryString = useMemo(() => {
    return {
      url: null,
    };
  }, []);

  const { queryString, setQueryString } = useQueryString(url);

  const parseData = useCallback((data) => {
    return { model: data };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['getModel', url],
    queryFn: () => readFileUrl({ url }),
    staleTime: 6 * 1000,
    select: (data) => parseData(data.data.data),
    enabled: !!url,
    retry: 2,
  });

  const handlePageChange = useCallback(
    ({ selected }) => {
      setQueryString({ ...queryString });
    },
    [queryString, setQueryString],
  );

  // useEffect(() => {
  //   if (!id) {
  //     setQueryString(defaultQueryString);
  //   }
  // }, [defaultQueryString, queryString, setQueryString]);

  return {
    file: data?.model,
    isSuccess,
    isLoading,
    totalPage: queryClient.getQueryData(['totalPageCampaigns']),
    handlePageChange,
  };
}
