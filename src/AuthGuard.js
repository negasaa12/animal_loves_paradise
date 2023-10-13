
import React from 'react';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children, userInfo }) {
  // Check if the user is authenticated (or meets your specific criteria)
  if (!userInfo) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child components
  return children;
}

export default AuthGuard;
