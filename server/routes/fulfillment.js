import { Router } from "express";
import { supabaseAdmin, isSupabaseConfigured } from "../lib/supabase.js";

const router = Router();

router.post("/trade-in", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, productName, conditionNotes, photoUrls } = req.body;
  const { data, error } = await supabaseAdmin.from("trade_ins").insert({
    user_id: userId,
    product_name: productName,
    condition_notes: conditionNotes,
    photo_urls: photoUrls || [],
    status: "submitted",
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ tradeIn: data });
});

router.patch("/trade-in/:id", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { status, estimatedValueCents } = req.body;
  const { data, error } = await supabaseAdmin.from("trade_ins")
    .update({ status, estimated_value_cents: estimatedValueCents })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ tradeIn: data });
});

router.post("/alterations", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, productName, requestNotes } = req.body;
  const { data, error } = await supabaseAdmin.from("alterations").insert({
    user_id: userId,
    product_name: productName,
    request_notes: requestNotes,
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ alteration: data });
});

router.post("/fitting", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, name, email, notes, scheduledAt } = req.body;
  const { data, error } = await supabaseAdmin.from("consults").insert({
    user_id: userId,
    name,
    email,
    notes,
    scheduled_at: scheduledAt,
    type: "in_home_fitting",
    status: "requested",
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ consult: data });
});

router.post("/returns", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, orderId, notes } = req.body;
  const { data, error } = await supabaseAdmin.from("orders")
    .update({ status: "returned" })
    .eq("id", orderId).select().single();
  if (error) return res.status(500).json({ error: error.message });
  await supabaseAdmin.from("consults").insert({
    user_id: userId,
    email: "returns@internal",
    notes: `Return request for order ${orderId}: ${notes}`,
    type: "general",
    status: "requested",
  });
  return res.json({ order: data });
});

router.post("/fit-profile", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, heightCm, sizes, photoUrl, notes } = req.body;
  const { data, error } = await supabaseAdmin.from("fit_profiles").upsert({
    user_id: userId,
    height_cm: heightCm,
    sizes,
    photo_url: photoUrl,
    notes,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ fitProfile: data });
});

export default router;
