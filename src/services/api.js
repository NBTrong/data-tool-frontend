import authApi from './config/authApi.config';
import publicApi from './config/publicApi.config';

// ------------------------------ Authentication ------------------------------
export const login = (data) =>
  publicApi({
    method: 'POST',
    url: '/login',
    data,
  });

export const signUp = (data) =>
  publicApi({
    method: 'POST',
    url: '/register',
    data,
  });

export const refreshToken = (data) =>
  publicApi({
    method: 'POST',
    url: '/refreshToken',
    data,
  });

export const logout = () =>
  authApi({
    method: 'POST',
    url: '/logout',
  });

export const forgotPassword = (email) => {
  publicApi({
    method: 'POST',
    url: '/forgotPassword',
    data: {
      email,
    },
  });
};

export const resetPassword = (data, token) =>
  publicApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PUT',
    url: '/updatePassword',
    data,
  });

export const getMe = () =>
  authApi({
    method: 'GET',
    url: '/users/me',
  });
// ------------------------------ Logger ------------------------------
export const getListLogger = (params) =>
  authApi({
    method: 'GET',
    url: '/loggers',
    params,
  });

export const getLoggerSummary = (params) =>
  authApi({
    method: 'GET',
    url: '/loggers/summary',
    params,
  });

export const getAmountLoggerByDay = (params) =>
  authApi({
    method: 'GET',
    url: '/loggers/amount-by-day',
    params,
  });

// ------------------------------ ExtractVideo ------------------------------

export const getListContent = (params) =>
  authApi({
    method: 'GET',
    url: '/hashtag',
    params,
  });

export const getListCampaigns = (params) =>
  authApi({
    method: 'GET',
    url: '/campaigns',
    params,
  });

export const getListInputFile = (params) =>
  authApi({
    method: 'GET',
    url: '/input-file',
    params,
  });

export const deleteCampaign = (params) =>
  authApi({
    method: 'DELETE',
    url: '/campaigns/' + params?.id,
    params,
  });

export const crawlData = (params) =>
  authApi({
    method: 'GET',
    url: '/crawl/' + params.platform,
    params,
  });

export const getCampaignContents = ({ campaignId }) =>
  authApi({
    method: 'GET',
    url: `/campaigns/${campaignId}/contents`,
  });

export const getTiktokPostsByKeyword = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/search/post`,
    params,
  });

export const getCategorySuggestion = (params) =>
  authApi({
    method: 'POST',
    url: `suggest`,
    params,
  });

export const getInstagramPostsByHashtag = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/instagram/search/posts`,
    params,
  });

export const getInstagramNoCORsImage = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/instagram/noCORs`,
    params,
  });

export const getPostsByKeywordRapidApi = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/hashtag-posts`,
    params,
  });

export const getTiktokHashtagId = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/hashtag-id`,
    params,
  });

export const getTiktokUserId = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/user-id`,
    params,
  });

export const getTiktokUserInfo = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/user-info`,
    params,
  });

export const getTiktokUserPosts = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/user-posts`,
    params,
  });

export const getInstagramUserPosts = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/instagram/user-posts`,
    params,
  });

export const getInstagramUserInfo = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/instagram/user-info`,
    params,
  });

export const getShopeeSearchKeywordVolume = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/shopee/${params.country}/search-keyword-volume`,
    params,
  });

export const getGoogleSearchKeywordVolume = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/google/${params.country}/search-keyword-volume`,
    params,
  });

export const getLazadaSearchKeywordVolume = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/lazada/${params.country}/search-keyword-volume`,
    params,
  });

export const getSearchKeywordSuggestions = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/shopee/${params?.country}/keyword-suggestion`,
    params,
  });

export const getListModels = (params) =>
  authApi({
    method: 'GET',
    url: `/suggest/models`,
  });

export const getModel = (params) =>
  authApi({
    method: 'GET',
    url: `/suggest`,
    params,
  });

export const searchModelKeywords = (params) =>
  authApi({
    method: 'GET',
    url: `/suggest/search`,
    params,
  });

export const readFileUrl = (params) =>
  authApi({
    method: 'GET',
    url: params.url,
  });

export const getYoutubeChannelVideos = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/youtube/channel-posts`,
    params,
  });

export const getYoutubeSearchVideos = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/youtube/search/posts`,
    params,
  });

export const getKeywordsConfidentRate = (params) =>
  authApi({
    method: 'POST',
    url: `/suggest/confidence`,
    params,
  });

export const transcriptFromVideoUrl = (params) =>
  authApi({
    method: 'POST',
    url: `/voice-to-text`,
    params,
  });

export const getSettingByType = (params) =>
  authApi({
    method: 'GET',
    url: `/settings/type`,
    params,
  });

export const getTiktokPostComments = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/post-comments`,
    params,
  });

export const getYoutubePostComments = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/youtube/post-comments`,
    params,
  });

export const getYoutubeVideoUrl = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/youtube/video-url`,
    params,
  });

export const getTiktokPostCommentReplies = (params) =>
  authApi({
    method: 'GET',
    url: `/crawl/tiktok/post-comment-replies`,
    params,
  });
