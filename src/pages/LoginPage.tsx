import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { GraduationCap } from 'lucide-react';
import { UNIVERSITIES, DEV_UNIVERSITIES } from '../data/universities';

const visibleUniversities =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_TEST_IDP === 'true'
    ? [...UNIVERSITIES, ...DEV_UNIVERSITIES]
    : UNIVERSITIES;

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
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
          Authentication requires a university account
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="university-select">
            Select your university
          </label>
          <select
            id="university-select"
            value={selectedUniversity}
            onChange={e => setSelectedUniversity(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Choose university…</option>
            {visibleUniversities.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          className="w-full"
          disabled={!selectedUniversity}
          onClick={() => login(selectedUniversity)}
        >
          Continue with university SSO
        </Button>
      </div>
    </div>
  );
}
