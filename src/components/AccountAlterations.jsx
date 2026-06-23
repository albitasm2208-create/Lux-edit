import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function AccountAlterations() {
  const { user } = useAuth();
  const [form, setForm] = useState({ productName: "", requestNotes: "" });
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/fulfillment/alterations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    setSent(true);
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 24px" }}>Alterations</h1>
      {sent ? <p>Alteration request submitted.</p> : (
        <form onSubmit={submit} style={{ maxWidth: 400 }}>
          <input placeholder="Piece name" required value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <textarea placeholder="What needs altering?" rows={3} required value={form.requestNotes} onChange={(e) => setForm({ ...form, requestNotes: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <button type="submit" className="le-btn">Request alteration</button>
        </form>
      )}
    </div>
  );
}
