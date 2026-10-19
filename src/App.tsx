import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute, PublicRoute, AdminRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { PhoneLogin } from './pages/PhoneLogin';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { AdminUsers } from './pages/AdminUsers';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <LocationProvider>
            <BrowserRouter>
              <ToastContainer />
              <Routes>
            {/* Public Auth Routes (Redirect to /dashboard if already logged in) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/phone-login"
              element={
                <PublicRoute>
                  <PhoneLogin />
                </PublicRoute>
              }
            />

            {/* Protected Routes (Accessible only when logged in) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/selling"
              element={
                <ProtectedRoute>
                  <Dashboard initialTab="selling" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prices"
              element={
                <ProtectedRoute>
                  <Dashboard initialTab="prices" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/markets"
              element={
                <ProtectedRoute>
                  <Dashboard initialTab="prices" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Dashboard initialTab="community" />
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
              path="/admin"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />

            {/* Default root path shows /login */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            {/* Catch-all unknown routes */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
          </BrowserRouter>
          </LocationProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
