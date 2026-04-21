import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function AdminRoute() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
