import { Router } from "express";
import { supabaseAdmin, isSupabaseConfigured } from "../lib/supabase.js";
import { sendEmail } from "../lib/resend.js";

const router = Router();

router.get("/", async (req, res) => {
  if (!isSupabaseConfigured()) return res.json({ orders: [] });
  const userId = req.query.userId;
  let q = supabaseAdmin.from("orders").select("*, capsules(season)").order("created_at", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ orders: data });
});

router.post("/", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, capsuleId, shippingAddress, priority } = req.body;
  const { data, error } = await supabaseAdmin.from("orders").insert({
    user_id: userId,
    capsule_id: capsuleId,
    shipping_address: shippingAddress,
    priority: priority || false,
    status: "pending",
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ order: data });
});

router.patch("/:id/status", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { status, trackingNumber, email } = req.body;
  const { data, error } = await supabaseAdmin.from("orders")
    .update({ status, tracking_number: trackingNumber, updated_at: new Date().toISOString() })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });

  if (email) {
    await sendEmail({
      to: email,
      subject: `Order update: ${status}`,
      html: `<p>Your order status is now <strong>${status}</strong>${trackingNumber ? `. Tracking: ${trackingNumber}` : ""}.</p>`,
    });
  }
  return res.json({ order: data });
});

export default router;
