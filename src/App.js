import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { createContext, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ConfirmProvider from './context/ConfirmDialogContext';
import { UnderDevelopmentProvider } from './context/UnderDevelopmentContext';

import Router from './routes';

import './styles/app.sass';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

export const GlobalShareContext = createContext([]);

function App() {
  const [globalShare, setGlobalShare] = useState({});
  const [loadingExplore, setLoadingExplore] = useState(false);

  return (
    <GlobalShareContext.Provider
      value={{ globalShare, setGlobalShare, loadingExplore, setLoadingExplore }}
    >
      <>
        <QueryClientProvider client={queryClient}>
          <ToastContainer
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            pauseOnHover
            closeOnClick
          />
          <BrowserRouter>
            <AuthProvider>
              <ConfirmProvider>
                <UnderDevelopmentProvider>
                  <Router />
                </UnderDevelopmentProvider>
              </ConfirmProvider>
            </AuthProvider>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </>
    </GlobalShareContext.Provider>
  );
}

export default App;
