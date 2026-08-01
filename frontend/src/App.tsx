import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AuthPage } from './pages/AuthPage';
import { LabContainer } from './pages/LabContainer';
import { NotFound } from './pages/NotFound';
import { XpToast } from './components/XpToast';
import { Preloader } from './components/Preloader';
import { RouteTransition } from './components/RouteTransition';
import { ExperimentCursor } from './components/ExperimentCursor';

/* ── Route Guard: Layout wrapper ─────────────────── */
const AppLayoutRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

/* ── Route Guard: Protected (auth required) ─────── */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user);
  if (!user) return <Navigate to="/auth?mode=login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

/* ── Route Guard: Auth page (redirect if logged in) ─ */
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user);
  if (user && !user.isGuest) return <Navigate to="/" replace />;
  return <>{children}</>;
};

/* ── Auth Init Splash ─────────────────────────────── */
const AuthInitSplash: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'var(--bg-obsidian)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      padding: 'clamp(2rem, 6vw, 5rem)',
    }}
  >
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(2.5rem, 8vw, 7rem)',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        color: 'var(--text-primary)',
      }}
    >
      PLAYORITHM
    </div>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5625rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--signal-text)',
        marginTop: '1rem',
      }}
    >
      RESTORING SESSION...
    </div>
  </div>
);

/* ── Inner App (inside BrowserRouter) ────────────── */
function AppInner() {
  const isAuthInitializing = useAppStore((state) => state.isAuthInitializing);
  const checkSession = useAppStore((state) => state.checkSession);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Determine if we need the preloader (first visit per session)
  const needsPreloader =
    typeof window !== 'undefined' && !sessionStorage.getItem('playorithm_loaded');

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('playorithm_loaded', '1');
    setPreloaderDone(true);
  };

  // If preloader is needed and not done yet, show it
  if (needsPreloader && !preloaderDone) {
    return (
      <Preloader
        onComplete={handlePreloaderComplete}
        minDuration={800}
      />
    );
  }

  if (isAuthInitializing) {
    return <AuthInitSplash />;
  }

  return (
    <>
      <ExperimentCursor />
      <XpToast />

      <RouteTransition>
        <Routes>
          {/* Auth */}
          <Route
            path="/auth"
            element={
              <PublicAuthRoute>
                <AuthPage />
              </PublicAuthRoute>
            }
          />

          {/* Public routes */}
          <Route
            path="/"
            element={
              <AppLayoutRoute>
                <LandingPage />
              </AppLayoutRoute>
            }
          />
          <Route
            path="/labs"
            element={
              <AppLayoutRoute>
                <Dashboard />
              </AppLayoutRoute>
            }
          />
          <Route
            path="/labs/:labId"
            element={
              <AppLayoutRoute>
                <LabContainer />
              </AppLayoutRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <AppLayoutRoute>
                <Leaderboard />
              </AppLayoutRoute>
            }
          />

          {/* Protected */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteTransition>
    </>
  );
}

/* ── Root App ─────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
