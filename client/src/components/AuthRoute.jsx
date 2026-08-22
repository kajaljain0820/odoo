import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect private page views
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-obsidian)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(6, 182, 212, 0.1)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Protect public only views (like Login/Register)
export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

// Protect admin only views
export const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user && user.is_admin ? <Outlet /> : <Navigate to="/" replace />;
};
