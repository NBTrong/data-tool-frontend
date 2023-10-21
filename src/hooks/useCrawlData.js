import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useQueryString from './useQueryString';

import { crawlData } from '../services/api';
import {getPostId} from "../utils/helpers";

export default function useCrawlData({ platform, url,isActive,refresh }) {
  const post_id = getPostId(url, platform);
  const queryClient = useQueryClient();

  const { queryString } = useQueryString({ platform, post_id });

  const parseData = useCallback((data) => {
    if (platform == 'tiktok') {
      data = data?.aweme_detail;
      return {
        url,
        post_id,
        no_more_comments: false,
        thumb_url: data?.video.ai_dynamic_cover.url_list[0] ?? '',
        title: data?.desc,
        created_at: data?.create_time ?? '',
        platform,
        file_url: data?.video?.play_addr?.url_list[data?.video?.play_addr?.url_list.length - 1 ?? 0],
        statistics: {
          comment_count: data?.statistics?.comment_count ?? '',
          view_count: data?.statistics?.play_count ?? '',
          share_count: data?.statistics?.share_count ?? '',
          save_count: data?.statistics?.collect_count ?? '',
          like_count: data?.statistics?.digg_count ?? '',
        },
        failed: !data?.video
      };
    }
    if (platform == 'youtube') {
      return {
        url,
        no_more_comments: false,
        thumb_url: data?.items[0].snippet.thumbnails.default.url ?? '',
        title: data?.items[0].snippet.title ?? '',
        created_at: data?.items[0].snippet.publishedAt ?? '',
        platform,
        statistics: {
          comment_count: data?.items[0].statistics?.commentCount ?? '',
          view_count: data?.items[0].statistics?.viewCount ?? '',
          share_count: '',
          save_count: '',
          like_count: data?.items[0].statistics?.likeCount ?? '',
        },
      };
    }
    if (platform == 'instagram') {
      const post_image = data?.image_versions2
        ? data?.image_versions2?.candidates[
            (data?.image_versions2?.candidates).length - 1
          ].url
        : data?.carousel_media[0]?.image_versions2?.candidates[
            (data.carousel_media[0]?.image_versions2?.candidates).length - 1
          ]?.url;
      return {
        url,
        thumb_url: post_image ?? '',
        title: data?.caption?.text ?? '',
        created_at: data?.caption?.created_at ?? '',
        platform,
        statistics: {
          comment_count: data?.comment_count ?? '',
          view_count: data?.play_count ?? '0',
          share_count: data?.reshare_count ?? '',
          save_count: '',
          like_count: data?.like_count ?? '',
        },
      };
    }

    return {
      url,
      platform,
      'title': "This platform is not supported"
    }
  }, []);
  console.log("ena",!!post_id && !!platform && !!isActive)
  console.log("ena",url)
  console.log("ena",post_id)
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ['crawl', queryString,refresh],
    queryFn: () => {
      return crawlData({
        ...queryString,refresh
      });
    },
    staleTime: Infinity,
    select: (data) => parseData(data?.data?.data),
    enabled: !!post_id && !!platform && !!isActive,
    onSuccess: (data) => {
      const preTotalPage = queryClient.getQueryData(['totalPageContent']);
      if (preTotalPage) {
        queryClient.setQueryData(
          ['totalPageContent'],
          data?.pagination.totalPage,
        );
      }
    },
    retry: 3,
  });

  return {
    crawlData: data ?? {
      title: '',
      url,
      failed: true
    },
    isSuccess,
    isLoading,
    isError,
    error,
  };
}
