import { useCallback } from 'react';
import useQueryString from './useQueryString';
import { useQuery } from '@tanstack/react-query';
import { getTiktokHashtagId, getTiktokUserId } from '../services/api';

export default function useTiktokUserId({ username, refresh }) {
  const { queryString } = useQueryString({ username, refresh });

  const parseData = useCallback((data) => {
    return { id: data };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['TiktokUserId', username, refresh],
    queryFn: () => getTiktokUserId({ username, refresh }),
    staleTime: 100000 * 1000,
    select: (data) => parseData(data.data.data),
    enabled: !!username,
    onSuccess: (data) => {},
    retry: 2,
  });

  return {
    uid: data?.id,
    isSuccess,
    isLoading,
  };
}
