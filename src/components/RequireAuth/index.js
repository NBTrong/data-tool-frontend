import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LazyLoading from '../LazyLoading';

const RequireAuth = ({ children, redirectTo }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === true) {
    return <>{children}</>;
  } else if (isAuthenticated === false) {
    return <Navigate to={redirectTo} />;
  } else {
    return <LazyLoading />;
  }
};

export default RequireAuth;
