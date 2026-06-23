import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookConsult from "./BookConsult.jsx";
import { useApp } from "../context/AppContext.jsx";
import { C } from "../lib/colors.js";

const TIERS = [
  { name: "Essential", price: "€500", per: "/ year", feat: ["AI-powered capsule planning", "Digital wardrobe previews", "Seasonal refresh"], dark: false },
  { name: "Premium", price: "€1,200", per: "/ year", feat: ["Everything in Essential", "Personal stylist consults", "Virtual try-on", "Priority delivery"], dark: true, tag: "Most chosen" },
  { name: "Concierge", price: "€2,500", per: "/ year", feat: ["Everything in Premium", "Full in-home fitting", "Seasonal wardrobe drop", "Luxury event access"], dark: false },
];

export default function Membership() {
  const navigate = useNavigate();
  const { selectTier } = useApp();
  const [showConsult, setShowConsult] = useState(false);
  const [consultTier, setConsultTier] = useState(null);

  const handleSelect = (tier) => {
    selectTier(tier.name);
    navigate("/membership/checkout");
  };

  return (
    <main style={{ padding: "clamp(40px,7vw,90px) 28px", maxWidth: 1100, margin: "0 auto" }}>
      <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>Membership</p>
      <h1 className="le-serif" style={{ fontSize: "clamp(34px,6vw,68px)", fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
        Choose how closely we work together.
      </h1>
      <p style={{ maxWidth: "54ch", fontSize: 16, lineHeight: 1.6, color: "rgba(26,24,21,0.74)", fontWeight: 300, marginBottom: 56 }}>
        Every tier is built on the same promise: fewer, better pieces, chosen for your life. Membership is annual and renews each season.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18, alignItems: "stretch" }}>
        {TIERS.map((t) => (
          <div key={t.name} style={{
            background: t.dark ? C.ink : C.ivory, color: t.dark ? C.paper : C.ink,
            border: `1px solid ${t.dark ? C.ink : C.line}`, padding: "34px 30px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 className="le-serif" style={{ fontSize: 28, fontWeight: 500, margin: 0 }}>{t.name}</h3>
              {t.tag && <span className="le-eyebrow" style={{ color: C.gold, fontSize: 10 }}>{t.tag}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 28 }}>
              <span className="le-serif" style={{ fontSize: 46, fontWeight: 500 }}>{t.price}</span>
              <span style={{ fontSize: 13, opacity: 0.6 }}>{t.per}</span>
            </div>
            <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, flex: 1 }}>
              {t.feat.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderTop: `1px solid ${t.dark ? "rgba(242,239,232,0.16)" : C.line}`, fontSize: 14, fontWeight: 300, lineHeight: 1.4 }}>
                  <span style={{ color: C.gold }}>—</span>{f}
                </li>
              ))}
            </ul>
            <button
              className={t.dark ? "le-btn" : "le-btn le-btn--ghost"}
              style={t.dark ? { background: C.paper, color: C.ink, border: `1px solid ${C.paper}` } : {}}
              onClick={() => handleSelect(t)}
            >
              Select {t.name}
            </button>
          </div>
        ))}
      </div>

      <section style={{ marginTop: 72 }}>
        <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 26 }}>Beyond membership</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 26 }}>
          {[
            ["Travel & event styling", "Vacation edits, fashion-week prep, gala looks — added to any tier."],
            ["Private label & atelier", "Exclusive pieces co-designed with selected luxury ateliers."],
            ["Sustainable resale", "Trade-in and resale through The RealReal and Vestiaire Collective."],
          ].map(([h, d], i) => (
            <div key={i}>
              <h3 className="le-serif" style={{ fontSize: 22, fontWeight: 500, margin: "0 0 8px" }}>{h}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(26,24,21,0.72)", fontWeight: 300, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
        <button className="le-btn le-btn--ghost" style={{ marginTop: 32 }} onClick={() => { setConsultTier(null); setShowConsult(true); }}>
          Book a consult
        </button>
      </section>

      {showConsult && <BookConsult onClose={() => setShowConsult(false)} tier={consultTier} />}
    </main>
  );
}

export { TIERS };
