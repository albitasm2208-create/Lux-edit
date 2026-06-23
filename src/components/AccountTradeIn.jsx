import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

const PARTNERS = [
  { name: "The RealReal", url: "https://www.therealreal.com/sell?utm_source=luxe_edit" },
  { name: "Vestiaire Collective", url: "https://www.vestiairecollective.com/sell-clothes-online/?utm_source=luxe_edit" },
];

export default function AccountTradeIn() {
  const { user } = useAuth();
  const [form, setForm] = useState({ productName: "", conditionNotes: "" });
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/fulfillment/trade-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    setSent(true);
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 24px" }}>Trade-in</h1>
      {sent ? <p>Trade-in submitted. A stylist will review your piece.</p> : (
        <form onSubmit={submit} style={{ maxWidth: 400, marginBottom: 40 }}>
          <input placeholder="Piece name" required value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <textarea placeholder="Condition notes" rows={3} value={form.conditionNotes} onChange={(e) => setForm({ ...form, conditionNotes: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12, border: `1px solid ${C.line}` }} />
          <button type="submit" className="le-btn">Submit trade-in</button>
        </form>
      )}
      <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 12 }}>Resale partners</p>
      {PARTNERS.map((p) => (
        <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="le-btn le-btn--ghost" style={{ display: "inline-block", marginRight: 12, marginBottom: 12, textDecoration: "none" }}>{p.name}</a>
      ))}
    </div>
  );
}
