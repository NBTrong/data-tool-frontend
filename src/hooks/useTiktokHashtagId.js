import { useCallback } from 'react';
import useQueryString from './useQueryString';
import { useQuery } from '@tanstack/react-query';
import { getTiktokHashtagId } from '../services/api';

export default function useTiktokHashtagId({ hashtag }) {
  const { queryString } = useQueryString({ hashtag });

  const parseData = useCallback((data) => {
    return { id: data };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['tiktokHashtagId', hashtag],
    queryFn: () => getTiktokHashtagId(queryString),
    staleTime: 36000 * 1000,
    select: (data) => parseData(data.data.data),
    enabled: !!hashtag,
    onSuccess: (data) => {},
    retry: 2,
  });

  return {
    cid: data?.id,
    isSuccess,
    isLoading,
  };
}
