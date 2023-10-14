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