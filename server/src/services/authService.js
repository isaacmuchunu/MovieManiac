import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

// Generate tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );

  return { accessToken, refreshToken };
};

// Calculate expiry date
const getRefreshTokenExpiry = () => {
  const days = parseInt(REFRESH_TOKEN_EXPIRES) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

// Register new user
export const registerUser = async (data) => {
  const { email, password, name } = data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with default profile and trial subscription
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      profiles: {
        create: {
          name,
          isKids: false,
        },
      },
      subscription: {
        create: {
          plan: 'FREE',
          status: 'TRIAL',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day trial
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profiles: true,
    },
  });

  // Generate tokens
  const tokens = generateTokens(user.id);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  logger.info(`New user registered: ${user.email}`);

  return { user, tokens };
};

// Login user
export const loginUser = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      profiles: true,
      subscription: true,
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokens(user.id);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  // Clean up old tokens (keep last 5)
  const oldTokens = await prisma.refreshToken.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    skip: 5,
  });

  if (oldTokens.length > 0) {
    await prisma.refreshToken.deleteMany({
      where: {
        id: { in: oldTokens.map((t) => t.id) },
      },
    });
  }

  logger.info(`User logged in: ${user.email}`);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, tokens };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token required', 401);
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Check if token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError('Refresh token not found', 401);
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError('Refresh token expired', 401);
  }

  if (!storedToken.user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  // Generate new tokens
  const tokens = generateTokens(storedToken.userId);

  // Update refresh token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      token: tokens.refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  // Clear user cache
  await cache.del(`user:${storedToken.userId}`);

  return tokens;
};

// Logout user
export const logoutUser = async (userId, refreshToken) => {
  // Delete specific refresh token
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // Clear user cache
  await cache.del(`user:${userId}`);

  logger.info(`User logged out: ${userId}`);
};

// Logout from all devices
export const logoutAllDevices = async (userId) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

  await cache.del(`user:${userId}`);

  logger.info(`User logged out from all devices: ${userId}`);
};

// Change password
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Invalidate all refresh tokens
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

  await cache.del(`user:${userId}`);

  logger.info(`Password changed for user: ${userId}`);
};
