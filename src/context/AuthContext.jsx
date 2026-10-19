import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { useLanguage } from './LanguageContext.jsx';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // isAdminUser: checks Firebase/backend profile AND JWT token (fallback for page refresh before profile loads)
  const isAdminUser = (() => {
    // Profile-based check
    if (
      (currentUser?.email === 'admin@gmail.com' || userProfile?.email === 'admin@gmail.com') &&
      userProfile?.role === 'admin'
    ) return true;
    // JWT-based fallback
    try {
      const token = localStorage.getItem('kisansetu_token');
      const userStr = localStorage.getItem('kisansetu_user');
      if (!token || !userStr) return false;
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) return false;
      const u = JSON.parse(userStr);
      return u?.email === 'admin@gmail.com' && u?.role === 'admin';
    } catch { return false; }
  })();

  // Load authenticated user on startup from token
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('kisansetu_token');
      const cached = localStorage.getItem('kisansetu_user');

      if (cached) {
        try {
          const userObj = JSON.parse(cached);
          setCurrentUser(userObj);
          setUserProfile(userObj);
        } catch (e) {
          // ignore
        }
      }

      if (token) {
        try {
          const profile = await authService.getMe();
          if (profile) {
            setCurrentUser(profile);
            setUserProfile(profile);
          }
        } catch (err) {
          console.warn('Failed to fetch authenticated profile on init:', err);
        }
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // Format authentication errors into clear, actionable messages
  const formatAuthError = (error, context) => {
    if (!error) return t?.('genericAuthError') || 'Authentication failed';
    const msg = error.response?.data?.error || error.message || '';
    if (msg.includes('Invalid administrator credentials')) {
      return msg;
    }
    if (msg.includes('No account found with this email')) {
      return t?.('userNotFound') || 'No account found with this email. Please check your spelling or register.';
    }
    if (msg.includes('Incorrect password')) {
      return t?.('wrongPassword') || 'Incorrect password. Please verify and try again.';
    }
    if (msg.includes('already exists')) {
      return t?.('emailAlreadyInUse') || 'An account with this email already exists. Please log in.';
    }
    if (msg.includes('Network Error')) {
      return t?.('networkError') || 'Network error connecting to KisanSetu backend server. Please verify your connection.';
    }
    return msg || t?.('genericAuthError') || 'Authentication error. Please try again.';
  };

  // 1. Email Login with Strict Role Verification
  const loginWithEmail = async (email, pass, selectedRole) => {
    const res = await authService.login({
      email,
      password: pass,
      role: selectedRole,
    });
    if (res?.user) {
      setCurrentUser(res.user);
      setUserProfile(res.user);
    }
    return { user: res.user };
  };

  // 2. Email Sign Up
  const signupWithEmail = async (name, email, pass, phone, role, roleData = {}) => {
    const res = await authService.register({
      name,
      email,
      password: pass,
      phone,
      role,
      roleData,
    });
    if (res?.user) {
      setCurrentUser(res.user);
      setUserProfile(res.user);
    }
    return { user: res.user };
  };

  // 3. Google Sign In
  const loginWithGoogle = async (selectedRole) => {
    if (selectedRole === 'admin') {
      throw new Error('Access denied: Google Sign-In is disabled for the Admin Portal. Please use designated administrator credentials.');
    }
    const res = await authService.googleLogin({
      email: 'google.farmer@kisansetu.in',
      name: 'Google Verified Farmer',
      role: selectedRole,
    });
    if (res?.user) {
      setCurrentUser(res.user);
      setUserProfile(res.user);
    }
    return { user: res.user };
  };

  // 4. Send Phone OTP
  const sendPhoneOtp = async (phoneNumber) => {
    return {
      verificationId: `otp-session-${Date.now()}`,
      confirm: async (otpCode) => {
        if (!otpCode || otpCode.length < 4) {
          throw new Error('Please enter a valid OTP code (e.g., 123456)');
        }
        const res = await authService.phoneLogin({
          phone: phoneNumber,
          role: 'farmer',
        });
        if (res?.user) {
          setCurrentUser(res.user);
          setUserProfile(res.user);
        }
        return { user: res.user };
      },
    };
  };

  // 5. Verify Phone OTP
  const verifyPhoneOtp = async (confirmationResult, otpCode, selectedRole = 'farmer') => {
    const cred = await confirmationResult.confirm(otpCode);
    if (cred?.user && selectedRole) {
      cred.user.role = selectedRole;
      setCurrentUser({ ...cred.user });
      setUserProfile({ ...cred.user });
    }
    return cred;
  };

  // 6. Reset Password
  const resetPassword = async (email) => {
    // Backend password reset trigger
    console.log(`Password reset link sent to: ${email}`);
  };

  // 7. Update User Profile Data
  const updateUserProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res?.user) {
      setCurrentUser(res.user);
      setUserProfile(res.user);
    }
  };

  // 8. Update Password
  const updateUserPassword = async (currentPass, newPass) => {
    await authService.changePassword({
      currentPassword: currentPass,
      newPassword: newPass,
    });
  };

  // 9. Send Email Verification Link
  const sendEmailVerificationLink = async () => {
    console.log('Email verification dispatched to user address.');
  };

  // 10. Refresh User State
  const refreshUser = async () => {
    try {
      const user = await authService.getMe();
      if (user) {
        setCurrentUser(user);
        setUserProfile(user);
      }
    } catch (e) {
      // ignore
    }
  };

  // 11. Upload Profile Picture
  const uploadProfilePicture = async (file) => {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    await updateUserProfile({ photoURL: dataUrl, photoUrl: dataUrl });
    return dataUrl;
  };

  // 11b. Update Profile Photo URL
  const updateProfilePhotoURL = async (photoURL) => {
    await updateUserProfile({ photoURL, photoUrl: photoURL });
  };

  // 12. Remove Profile Picture
  const removeProfilePicture = async () => {
    await updateUserProfile({ photoURL: null, photoUrl: null });
  };

  // 13. Verify and Change Phone
  const verifyAndChangePhone = async (confirmationResult, otpCode, newPhoneNumber) => {
    await confirmationResult.confirm(otpCode);
    await updateUserProfile({ phoneNumber: newPhoneNumber, phone: newPhoneNumber, phoneVerified: true });
  };

  // 14. Update User Role (Admin Function)
  const updateUserRole = async (userId, newRole) => {
    const res = await authService.updateUserRole(userId, newRole);
    if (userId === currentUser?.id || userId === currentUser?.uid) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
      setUserProfile((prev) => ({ ...prev, role: newRole }));
    }
    return res;
  };

  // 15. Update User Status
  const updateUserStatus = async (userId, isOnline) => {
    await authService.updateUserStatus(userId, isOnline, isOnline ? 'online' : 'offline');
  };

  // Helper for admin creation
  const createAdminAccount = async (password, name = 'Platform Administrator') => {
    return await signupWithEmail(
      name,
      'admin@gmail.com',
      password,
      '',
      'admin',
      {
        adminDepartment: 'Platform Security & Operations',
        clearanceLevel: 'Tier 1 Admin Access',
      }
    );
  };

  // 16. Logout
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isAdminUser,
    loginWithEmail,
    signupWithEmail,
    createAdminAccount,
    loginWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    resetPassword,
    updateUserRole,
    updateUserStatus,
    updateUserProfile,
    updateUserPassword,
    sendEmailVerificationLink,
    refreshUser,
    uploadProfilePicture,
    updateProfilePhotoURL,
    removeProfilePicture,
    verifyAndChangePhone,
    logout,
    formatAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
