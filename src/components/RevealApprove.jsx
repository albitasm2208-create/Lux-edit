import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import { C } from "../lib/colors.js";

export default function RevealApprove() {
  const [params] = useSearchParams();
  const capsuleId = params.get("capsule");
  const [capsule, setCapsule] = useState(null);

  useEffect(() => {
    if (!capsuleId) return;
    fetch(`/api/catalog/capsules/${capsuleId}`).then((r) => r.json()).then((d) => setCapsule(d.capsule));
  }, [capsuleId]);

  const setItemApproval = async (itemId, approved) => {
    await fetch(`/api/catalog/capsule-items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setCapsule((c) => ({
      ...c,
      capsule_items: c.capsule_items.map((i) => i.id === itemId ? { ...i, approved } : i),
    }));
  };

  const finalize = async () => {
    await fetch(`/api/catalog/capsules/${capsuleId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    alert("Capsule approved. Ready to order.");
  };

  if (!capsule) return <main style={{ padding: 80, textAlign: "center" }}>Loading capsule…</main>;

  const items = capsule.capsule_items || [];

  return (
    <main style={{ padding: "60px 28px", maxWidth: 1100, margin: "0 auto" }}>
      <p className="le-eyebrow" style={{ color: C.gold }}>Final approval</p>
      <h1 className="le-serif" style={{ fontSize: 42, margin: "0 0 32px" }}>Approve your edit</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 1, background: C.line }}>
        {items.map((ci, i) => {
          const p = ci.products || ci;
          return (
            <div key={ci.id} style={{ background: C.ivory }}>
              <ProductCard item={{
                name: p.name,
                brand: p.brand,
                imageUrl: p.image_url || p.imageUrl,
                priceRange: p.price_cents ? `€${(p.price_cents / 100).toFixed(0)}` : p.priceRange,
              }} index={i} />
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
                <button className="le-btn" style={{ padding: "8px 14px", fontSize: 10 }} onClick={() => setItemApproval(ci.id, true)}>{ci.approved === true ? "Approved" : "Approve"}</button>
                <button className="le-btn le-btn--ghost" style={{ padding: "8px 14px", fontSize: 10 }} onClick={() => setItemApproval(ci.id, false)}>Swap</button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="le-btn" style={{ marginTop: 32 }} onClick={finalize}>Finalize capsule</button>
      <Link to="/account" className="le-link" style={{ display: "block", marginTop: 16 }}>Account</Link>
    </main>
  );
}
