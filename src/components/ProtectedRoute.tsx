import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

// Helper: Parse JWT from localStorage and get payload
function getJwtUser(): Record<string, string> | null {
  try {
    const token = localStorage.getItem('kisansetu_token');
    const userStr = localStorage.getItem('kisansetu_user');
    if (!token || !userStr) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem('kisansetu_token');
      localStorage.removeItem('kisansetu_user');
      return null;
    }
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">{t('processing')}</p>
        </div>
      </div>
    );
  }

  const jwtUser = getJwtUser();
  if (!currentUser && !jwtUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">{t('processing')}</p>
        </div>
      </div>
    );
  }

  const jwtUser = getJwtUser();
  const jwtIsAdmin = jwtUser?.email === 'admin@gmail.com' && jwtUser?.role === 'admin';
  const firebaseIsAdmin = Boolean(currentUser?.email === 'admin@gmail.com' && userProfile?.role === 'admin');
  const isAuthorizedAdmin = firebaseIsAdmin || jwtIsAdmin;

  if (!currentUser && !jwtUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorizedAdmin) {
    const displayEmail = currentUser?.email || jwtUser?.email || 'Unknown';
    const displayRole = userProfile?.role || jwtUser?.role || 'Unassigned';
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
              403 Access Denied
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Admin Portal Restricted
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Admin Portal access is strictly restricted to the authenticated platform administrator (<strong>admin@gmail.com</strong>) with role <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">admin</code>. All other accounts are blocked.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1 font-mono text-slate-600 border border-slate-200">
            <div>Current Auth: <span className="text-slate-900 font-semibold">{displayEmail}</span></div>
            <div>Assigned Role: <span className="text-slate-900 font-semibold">{displayRole}</span></div>
            <div>Admin Status: <span className="text-rose-600 font-bold">Unauthorized & Blocked</span></div>
          </div>
          <button
            type="button"
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Return to Ecosystem Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">{t('processing')}</p>
        </div>
      </div>
    );
  }

  const jwtUser = getJwtUser();
  if (currentUser || jwtUser) {
    if (jwtUser?.role === 'admin' && jwtUser?.email === 'admin@gmail.com') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
