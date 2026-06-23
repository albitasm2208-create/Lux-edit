import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.js";
import emailRoutes from "./routes/email.js";
import capsuleRoutes from "./routes/capsules.js";
import orderRoutes from "./routes/orders.js";
import fulfillmentRoutes from "./routes/fulfillment.js";
import stripeRoutes from "./routes/stripe.js";
import { stripe, isStripeConfigured } from "./lib/stripe.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? ALLOWED_ORIGIN : true,
}));

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!isStripeConfigured()) return res.status(503).send("Stripe not configured");
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, tier } = session.metadata || {};
    const { supabaseAdmin, isSupabaseConfigured } = await import("./lib/supabase.js");
    if (isSupabaseConfigured() && userId) {
      await supabaseAdmin.from("profiles").update({
        membership_tier: tier?.toLowerCase(),
        stripe_customer_id: session.customer,
      }).eq("id", userId);
    }
  }
  res.json({ received: true });
});

app.use(express.json({ limit: "32kb" }));

app.use("/api", aiRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/catalog", capsuleRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/fulfillment", fulfillmentRoutes);
app.use("/api/stripe", stripeRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
