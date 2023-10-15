import authApi from './config/authApi.config';
import publicApi from './config/publicApi.config';

// ------------------------------ Authentication ------------------------------
export const login = (data) =>
  publicApi({
    method: 'POST',
    url: '/login',
    data,
  });

export const resetPassword = (data, token) =>
  publicApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PUT',
    url: '/updatePassword',
    data,
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