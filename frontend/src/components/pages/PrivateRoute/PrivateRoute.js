import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../pages/AuthContext/AuthContext'; 

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;
