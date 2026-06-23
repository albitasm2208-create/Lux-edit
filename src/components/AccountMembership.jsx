import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function AccountMembership() {
  const { profile, tier, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const checkout = async (selectedTier) => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier, userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Stripe not configured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 16px" }}>Membership</h1>
      <p style={{ marginBottom: 32 }}>Current tier: <strong>{tier}</strong></p>
      {["Essential", "Premium", "Concierge"].map((t) => (
        <button key={t} className="le-btn le-btn--ghost" style={{ marginRight: 12, marginBottom: 12 }} disabled={loading || tier === t.toLowerCase()} onClick={() => checkout(t)}>
          {tier === t.toLowerCase() ? `${t} (current)` : `Upgrade to ${t}`}
        </button>
      ))}
      <p style={{ fontSize: 13, color: "rgba(26,24,21,0.6)", marginTop: 24 }}>Requires Stripe price IDs in server .env</p>
    </div>
  );
}
