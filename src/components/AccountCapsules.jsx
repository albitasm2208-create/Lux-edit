import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

export default function FitProfile() {
  const { user, isPremium } = useAuth();
  const [form, setForm] = useState({ heightCm: "", sizes: { top: "", bottom: "", shoe: "" }, notes: "" });
  const [saved, setSaved] = useState(false);

  if (!isPremium) return null;

  const save = async (e) => {
    e.preventDefault();
    await fetch("/api/fulfillment/fit-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, heightCm: Number(form.heightCm), sizes: form.sizes, notes: form.notes }),
    });
    setSaved(true);
  };

  return (
    <section style={{ marginTop: 32, padding: 24, background: C.ivory, border: `1px solid ${C.line}` }}>
      <p className="le-eyebrow" style={{ color: C.gold }}>Fit profile (Premium)</p>
      {saved ? <p>Saved. Your stylist will reference these measurements.</p> : (
        <form onSubmit={save}>
          <input placeholder="Height (cm)" type="number" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 8, border: `1px solid ${C.line}` }} />
          <input placeholder="Top size" value={form.sizes.top} onChange={(e) => setForm({ ...form, sizes: { ...form.sizes, top: e.target.value } })} style={{ width: "100%", padding: 10, marginBottom: 8, border: `1px solid ${C.line}` }} />
          <input placeholder="Bottom size" value={form.sizes.bottom} onChange={(e) => setForm({ ...form, sizes: { ...form.sizes, bottom: e.target.value } })} style={{ width: "100%", padding: 10, marginBottom: 8, border: `1px solid ${C.line}` }} />
          <button type="submit" className="le-btn le-btn--ghost">Save fit profile</button>
        </form>
      )}
    </section>
  );
}

export function AccountCapsules() {
  const { user } = useAuth();
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured() || !user) return;
    supabase.from("capsules").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setCapsules(data || []));
  }, [user]);

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 24px" }}>My capsules</h1>
      {!capsules.length ? <p>No saved capsules yet. Complete the quiz to create your first edit.</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {capsules.map((c) => (
            <li key={c.id} style={{ padding: "16px 0", borderTop: `1px solid ${C.line}` }}>
              {c.season} — {c.status} — <a href={`/reveal/approve?capsule=${c.id}`}>View</a>
            </li>
          ))}
        </ul>
      )}
      <FitProfile />
    </div>
  );
}
