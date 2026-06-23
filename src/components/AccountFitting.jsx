import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function AccountFitting() {
  const { user, isPremium, isConcierge } = useAuth();
  const [form, setForm] = useState({ name: "", email: user?.email || "", notes: "", scheduledAt: "" });
  const [sent, setSent] = useState(false);

  if (!isPremium && !isConcierge) {
    return <p>Premium or Concierge membership required for in-home fitting.</p>;
  }

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/fulfillment/fitting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    setSent(true);
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 24px" }}>In-home fitting</h1>
      {sent ? <p>Your fitting request has been submitted.</p> : (
        <form onSubmit={submit} style={{ maxWidth: 400 }}>
          <input className="le-input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <input type="datetime-local" required value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <textarea placeholder="Address and notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <button type="submit" className="le-btn">Request fitting</button>
        </form>
      )}
    </div>
  );
}
