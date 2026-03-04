import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { GraduationCap } from 'lucide-react';

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/session', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-2">
        <GraduationCap className="h-12 w-12" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to Memo</h1>
        <p className="text-sm text-muted-foreground">
          Use your university email address to continue
        </p>
      </div>

      <div className="w-full max-w-sm rounded-lg border p-6">
        <Button className="w-full" onClick={() => login()}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
