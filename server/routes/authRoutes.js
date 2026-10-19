import express from 'express';
import {
  register,
  login,
  googleLogin,
  phoneLogin,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  syncUser,
  verifyUser,
  logout,
} from '../controllers/authController.js';
import { protect, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/signup', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/phone-login', phoneLogin);
router.post('/logout', protect, logout);
router.post('/sync-user', syncUser);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// User administration & directory (Strictly protected for Admin)
router.get('/users', protect, authorizeRole('admin'), getAllUsers);
router.get('/users/:id', protect, authorizeRole('admin'), getUserById);
router.put('/users/:id/role', protect, authorizeRole('admin'), updateUserRole);
router.put('/users/:id/status', protect, authorizeRole('admin'), updateUserStatus);
router.put('/users/:id/verify', protect, authorizeRole('admin'), verifyUser);

export default router;
