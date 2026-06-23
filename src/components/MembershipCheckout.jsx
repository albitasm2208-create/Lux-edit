import { useState } from "react";
import { Link } from "react-router-dom";
import { TIERS } from "./Membership.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";
import { track } from "../lib/analytics.js";

export default function MembershipCheckout() {
  const { selectedTier } = useApp();
  const { user } = useAuth();
  const tier = TIERS.find((t) => t.name === selectedTier) || TIERS[1];
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    track("checkout_start", { tier: tier.name });
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tier.name, userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Configure Stripe price IDs in server .env");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "clamp(40px,7vw,90px) 28px", maxWidth: 640, margin: "0 auto" }}>
      <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>Membership summary</p>
      <h1 className="le-serif" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, margin: "0 0 32px" }}>
        Your {tier.name} membership
      </h1>

      <div style={{ background: C.ivory, border: `1px solid ${C.line}`, padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 className="le-serif" style={{ fontSize: 28, margin: 0 }}>{tier.name}</h2>
          <span className="le-serif" style={{ fontSize: 36 }}>{tier.price}<span style={{ fontSize: 14, opacity: 0.6 }}>{tier.per}</span></span>
        </div>
        <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0 }}>
          {tier.feat.map((f, i) => (
            <li key={i} style={{ padding: "10px 0", borderTop: i > 0 ? `1px solid ${C.line}` : "none", fontSize: 14, fontWeight: 300 }}>{f}</li>
          ))}
        </ul>
        <button className="le-btn" disabled={loading} onClick={checkout}>
          {loading ? "Redirecting…" : "Complete membership"}
        </button>
      </div>

      <Link to="/membership" className="le-link" style={{ display: "inline-block", marginTop: 32 }}>← Back to tiers</Link>
    </main>
  );
}
