import { useCallback, useMemo, useEffect } from 'react';
import useQueryString from './useQueryString';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListInputFile } from '../services/api';

export default function useListInputFiles({ refresh, isPageChange }) {
  const queryClient = useQueryClient();

  const defaultQueryString = useMemo(() => {
    return {
      page: 1,
      limit: 10,
    };
  }, []);

  const { queryString, setQueryString } = useQueryString(refresh);

  const { page, limit, search } = queryString;

  const parseData = useCallback(
    (data) => {
      let inputFiles = data.inputFiles.map((item) => {
        return {
          ...item,
          status:
            item?.status?.trim() === 'created'
              ? 'In queue'
              : item?.status?.trim(),
          result_url: item?.result_url?.trim(),
          refresh,
        };
      });
      inputFiles = inputFiles.filter((item) => item?.status !== 'deleted');
      const pagination = {
        total: data.pagination.total,
        currentPage: data.pagination.currentPage,
        totalPage: data.pagination.totalPage,
        limit: data.pagination.limit,
      };
      return { pagination, inputFiles };
    },
    [refresh],
  );

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['input-file', page, limit, refresh, search],
    queryFn: () => getListInputFile({ page, limit, refresh, search }),
    staleTime: 0,
    select: (data) => parseData(data.data.data),
    enabled: !!page && !!limit,
    onSuccess: (data) => {
      const preTotalPage = queryClient.getQueryData(['totalPage']);
      if (preTotalPage !== data.pagination.totalPage) {
        queryClient.setQueryData(
          ['totalPageCampaigns'],
          data.pagination.totalPage,
        );
      }
    },
  });

  const handlePageChange = useCallback(
    ({ selected }) => {
      setQueryString({ ...queryString, page: selected + 1 });
    },
    [queryString, setQueryString],
  );

  useEffect(() => {
    if (!page || !limit) {
      setQueryString(defaultQueryString);
    }
  }, [defaultQueryString, limit, page, queryString, setQueryString]);

  return {
    inputFiles: data?.inputFiles,
    pagination: data?.pagination,
    isSuccess,
    isPageChange,
    isLoading,
    page,
    limit,
    totalPage: queryClient.getQueryData(['totalPageCampaigns']),
    handlePageChange,
  };
}
