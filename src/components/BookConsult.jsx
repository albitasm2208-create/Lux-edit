import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function BookConsult({ onClose, tier }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: user?.email || "", notes: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/email/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tier, userId: user?.id }),
    });
    setSent(true);
  };

  return (
    <div className="le-modal-overlay" onClick={onClose}>
      <div className="le-modal" onClick={(e) => e.stopPropagation()}>
        <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>Book a consult</p>
        {sent ? (
          <>
            <h2 className="le-serif" style={{ fontSize: 28, margin: "0 0 16px" }}>Request received</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>A stylist will reach out within 24 hours to confirm your session.</p>
            <button className="le-btn" onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <h2 className="le-serif" style={{ fontSize: 28, margin: "0 0 24px" }}>Schedule your session</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {tier && <p style={{ fontSize: 13, marginBottom: 16 }}>Tier: {tier}</p>}
              <textarea placeholder="Anything you'd like us to know?" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="le-btn">Submit request</button>
                <button type="button" className="le-btn le-btn--ghost" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
