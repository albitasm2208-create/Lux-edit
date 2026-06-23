import { Router } from "express";
import { stripe, TIER_PRICES, isStripeConfigured } from "../lib/stripe.js";

const router = Router();

router.post("/create-checkout-session", async (req, res) => {
  if (!isStripeConfigured()) return res.status(503).json({ error: "Stripe not configured." });

  const { tier, userId, email } = req.body;
  const priceId = TIER_PRICES[tier];
  if (!priceId) return res.status(400).json({ error: "Invalid tier." });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL || "http://localhost:5173"}/account/membership?success=1`,
    cancel_url: `${process.env.APP_URL || "http://localhost:5173"}/membership/checkout?cancel=1`,
    metadata: { userId: userId || "", tier },
  });

  return res.json({ url: session.url });
});

export default router;
