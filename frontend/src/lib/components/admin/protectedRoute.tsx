// ===========================
// Protected Route Component
// ©AngelaMos | 2025
// ===========================

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.JSX.Element;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};
