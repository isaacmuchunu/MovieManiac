import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { AppError, asyncHandler } from './errorHandler.js';
import { cache } from '../config/redis.js';

// Verify access token
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header or cookie
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError('Not authenticated', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Check if user exists and is active
    const cacheKey = `user:${decoded.userId}`;
    let user = await cache.get(cacheKey);

    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          subscription: {
            select: {
              plan: true,
              status: true,
            },
          },
        },
      });

      if (user) {
        await cache.set(cacheKey, user, 300); // Cache for 5 minutes
      }
    }

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Invalid token', 401);
  }
});

// Optional authentication (doesn't fail if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }

  next();
});

// Check if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Not authorized to access this resource', 403);
    }

    next();
  };
};

// Check if user has active subscription
export const requireSubscription = (...plans) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const subscription = req.user.subscription;

    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new AppError('Active subscription required', 403);
    }

    if (plans.length > 0 && !plans.includes(subscription.plan)) {
      throw new AppError('Your subscription plan does not include this feature', 403);
    }

    next();
  });
};

// Check content access based on subscription
export const checkContentAccess = asyncHandler(async (req, res, next) => {
  const { contentId } = req.params;

  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { maturityRating: true, isPublished: true },
  });

  if (!content || !content.isPublished) {
    throw new AppError('Content not found', 404);
  }

  // Check subscription status
  const subscription = req.user.subscription;
  if (!subscription || subscription.status !== 'ACTIVE') {
    throw new AppError('Active subscription required', 403);
  }

  // Quality restrictions based on plan
  req.maxQuality = getMaxQualityForPlan(subscription.plan);

  next();
});

function getMaxQualityForPlan(plan) {
  const qualityMap = {
    FREE: 'SD_480',
    BASIC: 'HD_720',
    STANDARD: 'FHD_1080',
    PREMIUM: 'UHD_4K',
  };
  return qualityMap[plan] || 'SD_480';
}
