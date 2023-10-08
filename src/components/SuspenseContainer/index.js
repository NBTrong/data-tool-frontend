import React, { Suspense } from 'react';
import LazyLoading from '../LazyLoading';

const SuspenseContainer = ({ children }) => {
  return <Suspense fallback={<LazyLoading />}>{children}</Suspense>;
};

export default SuspenseContainer;
