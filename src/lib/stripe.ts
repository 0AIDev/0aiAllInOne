import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  : null;

export const STRIPE_PLANS = {
  FREE: {
    tier: "FREE",
    tokensPerMonth: 100_000,
    requestsPerMin: 60,
    maxApiKeys: 3,
    monthlyPrice: 0,
  },
  STARTER: {
    tier: "STARTER",
    tokensPerMonth: 5_000_000,
    requestsPerMin: 200,
    maxApiKeys: 10,
    monthlyPrice: 29_00,
  },
  PRO: {
    tier: "PRO",
    tokensPerMonth: 20_000_000,
    requestsPerMin: 500,
    maxApiKeys: 50,
    monthlyPrice: 99_00,
  },
  BUSINESS: {
    tier: "BUSINESS",
    tokensPerMonth: 100_000_000,
    requestsPerMin: 2000,
    maxApiKeys: 200,
    monthlyPrice: 399_00,
  },
  ENTERPRISE: {
    tier: "ENTERPRISE",
    tokensPerMonth: 500_000_000,
    requestsPerMin: 10000,
    maxApiKeys: 1000,
    monthlyPrice: 999_00,
  },
} as const;
