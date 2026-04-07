import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SessionPage } from './pages/SessionPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ImprintPage } from './pages/ImprintPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminPage } from './pages/AdminPage';
import { ModerationPage } from './pages/ModerationPage';
import { ImportPage } from './pages/ImportPage';
import { RolesPage } from './pages/RolesPage';
import { ExportPage } from './pages/ExportPage';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider defaultTheme="system" storageKey="memo-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/imprint" element={<ImprintPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/session" element={<SessionPage />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                  <Route
                    path="/admin/moderation"
                    element={<ModerationPage />}
                  />
                  <Route path="/admin/import" element={<ImportPage />} />
                  <Route path="/admin/roles" element={<RolesPage />} />
                  <Route path="/admin/export" element={<ExportPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
