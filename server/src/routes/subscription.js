import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../config/database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  BASIC: {
    name: 'Basic',
    price: 8.99,
    features: ['HD streaming', '1 screen', 'Watch on phone & tablet'],
    maxQuality: 'HD_720',
    screens: 1,
  },
  STANDARD: {
    name: 'Standard',
    price: 13.99,
    features: ['Full HD streaming', '2 screens', 'Watch on any device', 'Download'],
    maxQuality: 'FHD_1080',
    screens: 2,
  },
  PREMIUM: {
    name: 'Premium',
    price: 17.99,
    features: ['4K + HDR streaming', '4 screens', 'Watch on any device', 'Download', 'Spatial audio'],
    maxQuality: 'UHD_4K',
    screens: 4,
  },
};

// Get available plans
router.get('/plans', asyncHandler(async (req, res) => {
  res.json({ status: 'success', data: PLANS });
}));

// Get current subscription
router.get('/current', authenticate, asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
  });

  if (!subscription) {
    return res.json({
      status: 'success',
      data: { plan: 'FREE', status: 'ACTIVE' },
    });
  }

  const planDetails = PLANS[subscription.plan] || PLANS.BASIC;

  res.json({
    status: 'success',
    data: {
      ...subscription,
      planDetails,
    },
  });
}));

// Create checkout session
router.post('/checkout', authenticate, asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!['BASIC', 'STANDARD', 'PREMIUM'].includes(plan)) {
    throw new AppError('Invalid plan', 400);
  }

  const priceId = process.env[`STRIPE_PRICE_${plan}`];
  if (!priceId) {
    throw new AppError('Plan not configured', 500);
  }

  // Get or create Stripe customer
  let subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
  });

  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name,
      metadata: { userId: req.user.id },
    });
    customerId = customer.id;

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        plan: 'FREE',
        status: 'ACTIVE',
        stripeCustomerId: customerId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      update: { stripeCustomerId: customerId },
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
    metadata: { userId: req.user.id, plan },
  });

  res.json({ status: 'success', data: { sessionId: session.id, url: session.url } });
}));

// Create customer portal session
router.post('/portal', authenticate, asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    throw new AppError('No billing account found', 404);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.CLIENT_URL}/account`,
  });

  res.json({ status: 'success', data: { url: session.url } });
}));

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  logger.info(`Stripe webhook received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { userId, plan } = session.metadata;

      await prisma.subscription.update({
        where: { userId },
        data: {
          plan,
          status: 'ACTIVE',
          stripeSubscriptionId: session.subscription,
        },
      });

      await cache.del(`user:${userId}`);
      logger.info(`Subscription activated for user ${userId}: ${plan}`);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription.customer);
      const userId = customer.metadata.userId;

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });

      await cache.del(`user:${userId}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription.customer);
      const userId = customer.metadata.userId;

      await prisma.subscription.update({
        where: { userId },
        data: {
          plan: 'FREE',
          status: 'EXPIRED',
          stripeSubscriptionId: null,
        },
      });

      await cache.del(`user:${userId}`);
      logger.info(`Subscription cancelled for user ${userId}`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customer = await stripe.customers.retrieve(invoice.customer);
      const userId = customer.metadata.userId;

      await prisma.subscription.update({
        where: { userId },
        data: { status: 'PAST_DUE' },
      });

      await cache.del(`user:${userId}`);
      logger.warn(`Payment failed for user ${userId}`);
      break;
    }
  }

  res.json({ received: true });
}));

// Cancel subscription
router.post('/cancel', authenticate, asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new AppError('No active subscription found', 404);
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { userId: req.user.id },
    data: { cancelAtPeriodEnd: true },
  });

  await cache.del(`user:${req.user.id}`);

  res.json({
    status: 'success',
    message: 'Subscription will be cancelled at the end of the billing period',
  });
}));

export default router;
