import React from 'react';
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
import { XpToast } from './components/XpToast';

// Route Guard for Protected Pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Route Guard for Guest / Public Auth page
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Global XP Rewards Toast Notifications */}
      <XpToast />

      <Routes>
        {/* Auth Route */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />

        {/* Protected Dashboard/Lab Workspaces */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/labs" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/labs/:labId" 
          element={
            <ProtectedRoute>
              <LabContainer />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } 
        />

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

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
