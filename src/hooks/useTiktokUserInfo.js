import { useCallback } from 'react';
import useQueryString from './useQueryString';
import { useQuery } from '@tanstack/react-query';
import {getTiktokUserInfo} from '../services/api';

export default function useTiktokUserInfo({ username, refresh }) {
  const parseData = useCallback((res) => {
    const data = res?.userInfo;
    const user = {
      avatar_thumb: data?.user?.avatarThumb,
      total_posts: data?.stats?.videoCount,
    }
    const notfound = data?.user;
    return { id: data?.user?.id,user,notfound };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['TiktokUserId', username, refresh],
    queryFn: () => getTiktokUserInfo({ username, refresh }),
    staleTime: 0,
    select: (data) => parseData(data.data.data),
    enabled: !!username,
    onSuccess: (data) => {},
    retry: 2,
  });

  return {
    uid: data?.id,
    user: data?.user,
    notfound: data?.notfound,
    isSuccess,
    isLoading,
  };
}
