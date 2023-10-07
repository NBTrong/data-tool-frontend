import React, { useState, createContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  login as loginFn,
  refreshToken as refreshTokenFn,
  logout as logoutFn,
} from '../services/api';
import token from '../utils/token';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const [me, setMe] = useState(null);

  const saveMe = useCallback((data) => {
    const me = {
      id: data.id,
      username: data.username,
      email: data.email,
      address: data.address,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      color: data.color,
      phone: data.phone,
    };
    setMe(me);
  }, []);

  const loginWithEmail = useCallback(
    async (data) => {
      try {
        const response = await loginFn(data);

        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        saveMe(response.data.data.user);

        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        setIsAuthenticated(true);

        toast.success('Login success');
        navigate.push('/', { replace: true });
        return true;
      } catch (e) {
        return e?.response?.data?.message
      }
    },
    [navigate, saveMe],
  );

  const loginWithToken = useCallback(async () => {
    try {
      const oldRefreshToken = token.getRefreshToken();

      const response = await refreshTokenFn({ refreshToken: oldRefreshToken });

      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      saveMe(response.data.data.user);

      token.setAccessToken(accessToken);
      token.setRefreshToken(refreshToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      token.removeAccessToken();
      token.removeRefreshToken();
      setIsAuthenticated(false);
      queryClient.clear();
    }
  }, [queryClient, saveMe]);

  const logout = async () => {
    try {
      await logoutFn();
      token.removeAccessToken();
      token.removeRefreshToken();
      setIsAuthenticated(false);
      queryClient.clear();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const refreshToken = token.getRefreshToken();
    if (refreshToken) {
      loginWithToken();
    } else {
      setIsAuthenticated(false);
    }
  }, [loginWithToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginWithEmail, logout, me }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
