import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the authentication context or hook

function AuthRoute({ element, ...rest }) {
  const { user } = useAuth(); // Use the authentication context or hook to check if the user is authenticated

  return (
    <Route
      {...rest}
      element={user ? element : <Navigate to="/login" />} // Redirect to the login page if the user is not authenticated
    />
  );
}

export default AuthRoute;
