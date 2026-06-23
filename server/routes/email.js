import { Router } from "express";
import { supabaseAdmin, isSupabaseConfigured } from "../lib/supabase.js";
import { sendEmail } from "../lib/resend.js";

const router = Router();

router.post("/send-edit", async (req, res) => {
  const { email, summary, items, season } = req.body;
  if (!email) return res.status(400).json({ error: "Email required." });

  const list = (items || []).map((it, i) =>
    `<li>${i + 1}. ${it.name || it} — ${it.brand || ""} ${it.priceRange || ""}</li>`
  ).join("");

  await sendEmail({
    to: email,
    subject: `Your ${season || "Seasonal"} Edit — The Luxe Edit`,
    html: `<p>Your capsule is ready.</p><p>${summary || ""}</p><ul>${list}</ul><p>— The Luxe Edit</p>`,
  });

  if (isSupabaseConfigured()) {
    await supabaseAdmin.from("consults").insert({ email, notes: "Edit delivery requested", type: "general", status: "completed" });
  }

  return res.json({ ok: true });
});

router.post("/consult", async (req, res) => {
  const { name, email, notes, tier, userId } = req.body;
  if (!email) return res.status(400).json({ error: "Email required." });

  if (isSupabaseConfigured()) {
    await supabaseAdmin.from("consults").insert({
      user_id: userId || null,
      name,
      email,
      notes,
      tier,
      type: "general",
      status: "requested",
    });
  }

  await sendEmail({
    to: email,
    subject: "Consult request received — The Luxe Edit",
    html: `<p>Thank you, ${name || "there"}. A stylist will reach out within 24 hours.</p>`,
  });

  return res.json({ ok: true });
});

router.post("/capsule-approved", async (req, res) => {
  const { email, capsuleId } = req.body;
  await sendEmail({
    to: email,
    subject: "Your edit is ready for final approval",
    html: `<p>Your stylist has refined your seasonal capsule. <a href="${process.env.APP_URL || ""}/reveal/approve?capsule=${capsuleId}">Review your edit</a></p>`,
  });
  return res.json({ ok: true });
});

export default router;
