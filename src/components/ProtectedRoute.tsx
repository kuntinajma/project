import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, loading, user, token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      console.log("Protected route check:", { 
        isAuthenticated, 
        path: location.pathname,
        user: user?.name,
        role: user?.role,
        hasToken: !!token
      });
    }
  }, [isAuthenticated, loading, location.pathname, user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    // Save the location the user was trying to access for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log(`Access denied: User role ${user.role} not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;