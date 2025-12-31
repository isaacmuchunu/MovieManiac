import express from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import * as authService from '../services/authService.js';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Set cookie options
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge,
});

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const { user, tokens } = await authService.registerUser(data);

  // Set cookies
  res.cookie('accessToken', tokens.accessToken, getCookieOptions(15 * 60 * 1000)); // 15 min
  res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

  res.status(201).json({
    status: 'success',
    data: { user, tokens },
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const { user, tokens } = await authService.loginUser(data.email, data.password);

  // Set cookies
  res.cookie('accessToken', tokens.accessToken, getCookieOptions(15 * 60 * 1000));
  res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

  res.json({
    status: 'success',
    data: { user, tokens },
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  const tokens = await authService.refreshAccessToken(refreshToken);

  // Set cookies
  res.cookie('accessToken', tokens.accessToken, getCookieOptions(15 * 60 * 1000));
  res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

  res.json({
    status: 'success',
    data: { tokens },
  });
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  await authService.logoutUser(req.user.id, refreshToken);

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
}));

// Logout all devices
router.post('/logout-all', authenticate, asyncHandler(async (req, res) => {
  await authService.logoutAllDevices(req.user.id);

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({
    status: 'success',
    message: 'Logged out from all devices',
  });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    data: { user: req.user },
  });
}));

// Change password
router.post('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password required', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters', 400);
  }

  await authService.changePassword(req.user.id, currentPassword, newPassword);

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({
    status: 'success',
    message: 'Password changed successfully. Please login again.',
  });
}));

export default router;
