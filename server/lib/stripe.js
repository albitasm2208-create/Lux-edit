import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

export const TIER_PRICES = {
  Essential: process.env.STRIPE_PRICE_ESSENTIAL,
  Premium: process.env.STRIPE_PRICE_PREMIUM,
  Concierge: process.env.STRIPE_PRICE_CONCIERGE,
};

export function isStripeConfigured() {
  return Boolean(stripe);
}
