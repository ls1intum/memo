import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { GraduationCap } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, domainError, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (domainError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <GraduationCap className="h-12 w-12" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Access denied
          </h1>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Your email domain is not permitted. Please use a university email
            address.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-lg border p-6">
          <Button variant="outline" className="w-full" onClick={() => logout()}>
            Sign out and try a different account
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
