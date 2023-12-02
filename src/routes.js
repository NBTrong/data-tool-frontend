import React, { lazy, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { GlobalShareContext } from './App';
import RequireAuth from './components/RequireAuth';
import SuspenseContainer from './components/SuspenseContainer';

const SignIn = lazy(() => import('./screens/SignIn'));
const SignUp = lazy(() => import('./screens/SignUp'));
const ResetPassword = lazy(() => import('./screens/ResetPassword'));
const ForgotPassword = lazy(() => import('./screens/ForgotPassword'));
const Page = lazy(() => import('./components/Page'));
const ExtractVideo = lazy(() => import('./screens/ExtractVideo'));
const ExtractComments = lazy(() => import('./screens/ExtractComment'));
const Queue = lazy(() => import('./screens/Queue'));
const KeywordExploreTiktok = lazy(() =>
  import('./screens/KeywordExplore/TiktokHashtag'),
);

const ChannelExploreTiktok = lazy(() =>
  import('./screens/ChannelExplore/Tiktok'),
);

const Router = () => {
  const { globalShare } = useContext(GlobalShareContext);

  return (
    <Routes>
      <Route exact path="/*" element={<Navigate to="/extract-data/videos" />} />
      <Route
        exact
        path="/extract-data/*"
        element={
          <RequireAuth redirectTo="/sign-in">
            <SuspenseContainer>
              <Page title={globalShare?.title ?? 'Extract videos'} wide>
                <ExtractVideo />
              </Page>
            </SuspenseContainer>
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/extract-data/comments"
        element={
          <RequireAuth redirectTo="/sign-in">
            <SuspenseContainer>
              <Page title={globalShare?.title ?? 'Extract comments'} wide>
                <ExtractComments />
              </Page>
            </SuspenseContainer>
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/queue/*"
        element={
          <RequireAuth redirectTo="/sign-in">
            <SuspenseContainer>
              <Page title="File queue" wide>
                <Queue />
              </Page>
            </SuspenseContainer>
          </RequireAuth>
        }
      />

      <Route
        exact
        path="/channel-explore/tiktok"
        element={
          <RequireAuth redirectTo="/sign-in">
            <SuspenseContainer>
              <Page title="TikTok Channel Explore" wide>
                <ChannelExploreTiktok />
              </Page>
            </SuspenseContainer>
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/keyword-explore/tiktok"
        element={
          <RequireAuth redirectTo="/sign-in">
            <SuspenseContainer>
              <Page title="TikTok Keyword Explore" wide>
                <KeywordExploreTiktok />
              </Page>
            </SuspenseContainer>
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/sign-in"
        element={
          <SuspenseContainer>
            <SignIn />
          </SuspenseContainer>
        }
      />
      <Route
        exact
        path="/sign-up"
        element={
          <SuspenseContainer>
            <SignUp />
          </SuspenseContainer>
        }
      />
      <Route
        exact
        path="/reset-password"
        element={
          <SuspenseContainer>
            <ResetPassword />
          </SuspenseContainer>
        }
      />
      <Route
        exact
        path="/forgot-password"
        element={
          <SuspenseContainer>
            <ForgotPassword />
          </SuspenseContainer>
        }
      />
    </Routes>
  );
};

export default Router;
