import { useCallback, useMemo, useEffect } from 'react';
import useQueryString from './useQueryString';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCampaignContents } from '../services/api';

export default function useCampaignContents() {
  const queryClient = useQueryClient();

  const defaultQueryString = useMemo(() => {
    return {
      campaignId: null,
    };
  }, []);

  const { queryString, setQueryString } = useQueryString();

  const { campaignId } = queryString;

  const parseData = useCallback((data) => {
    const campaign = {
      id: data.campaign.id,
      title: data.campaign.title,
    };
    const contents = data.campaign?.campaign_contents?.map((item) => {
      return {
        id: item.id,
        campaign_id: item.campaign_id,
        created_at: item.created_at,
        platform: item.platform,
        thumb_url: item.thumb_url,
        url: item.post_url,
        title: item.title,
        statistics: {
          comment_count: item.total_comments,
          like_count: item.total_likes,
          save_count: item.total_saves,
          share_count: item.total_shares,
          view_count: item.total_views,
        },
      };
    });
    return { campaign, contents };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['campaignContents', campaignId],
    queryFn: () => getCampaignContents(queryString),
    staleTime: 60 * 1000,
    select: (data) => parseData(data.data.data),
    enabled: !!campaignId,
    onSuccess: (data) => {},
  });

  const handlePageChange = useCallback(
    ({ selected }) => {
      setQueryString({ ...queryString });
    },
    [queryString, setQueryString],
  );

  useEffect(() => {}, [defaultQueryString, queryString, setQueryString]);

  return {
    campaign: data?.campaign,
    contents: data?.contents,
    isSuccess,
    isLoading,
    enabled: !!campaignId,
    totalPage: queryClient.getQueryData(['totalPageCampaigns']),
    handlePageChange,
  };
}
