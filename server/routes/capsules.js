import { Router } from "express";
import { supabaseAdmin, isSupabaseConfigured } from "../lib/supabase.js";

const router = Router();

router.get("/products", async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res.json({ products: [], source: "local" });
  }
  const { data, error } = await supabaseAdmin.from("products").select("*").eq("active", true);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ products: data, source: "supabase" });
});

router.post("/products", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { data, error } = await supabaseAdmin.from("products").insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ product: data });
});

router.put("/products/:id", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { data, error } = await supabaseAdmin.from("products").update(req.body).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ product: data });
});

router.delete("/products/:id", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { error } = await supabaseAdmin.from("products").update({ active: false }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true });
});

router.get("/capsules/:id", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { data: capsule, error } = await supabaseAdmin
    .from("capsules")
    .select("*, capsule_items(*, products(*))")
    .eq("id", req.params.id)
    .single();
  if (error) return res.status(404).json({ error: error.message });
  return res.json({ capsule });
});

router.post("/capsules", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { userId, season, styleProfileId, items, status } = req.body;
  const { data: capsule, error } = await supabaseAdmin.from("capsules").insert({
    user_id: userId,
    season,
    style_profile_id: styleProfileId,
    status: status || "pending_review",
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });

  if (items?.length) {
    await supabaseAdmin.from("capsule_items").insert(
      items.map((item, i) => ({
        capsule_id: capsule.id,
        product_id: item.productId,
        slot: i,
        approved: null,
      }))
    );
  }
  return res.json({ capsule });
});

router.patch("/capsules/:id/status", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { status, stylistNote } = req.body;
  const { data, error } = await supabaseAdmin.from("capsules")
    .update({ status, stylist_note: stylistNote, updated_at: new Date().toISOString() })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ capsule: data });
});

router.patch("/capsule-items/:id", async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Supabase not configured." });
  const { approved, swapRequested, productId } = req.body;
  const { data, error } = await supabaseAdmin.from("capsule_items")
    .update({ approved, swap_requested: swapRequested, product_id: productId })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ item: data });
});

router.get("/capsules/pending/review", async (_req, res) => {
  if (!isSupabaseConfigured()) return res.json({ capsules: [] });
  const { data, error } = await supabaseAdmin
    .from("capsules")
    .select("*, profiles(email, full_name), capsule_items(*, products(*))")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ capsules: data });
});

export default router;
