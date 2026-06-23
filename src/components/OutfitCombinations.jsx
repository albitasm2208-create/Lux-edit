import { C } from "../lib/colors.js";

export default function OutfitCombinations({ outfits }) {
  if (!outfits?.length) return null;

  return (
    <section style={{ marginTop: 56 }}>
      <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>How they work together</p>
      <h2 className="le-serif" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 500, margin: "0 0 28px" }}>
        Three edits from one capsule
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
        {outfits.map((outfit, i) => (
          <div key={i} className="le-outfit-card le-rise" style={{ animationDelay: `${i * 0.1}s` }}>
            <h3 className="le-serif" style={{ fontSize: 22, fontWeight: 500, margin: "0 0 16px" }}>{outfit.title}</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {outfit.pieces.map((piece, j) => (
                <li key={j} style={{ fontSize: 14, lineHeight: 1.6, padding: "6px 0", borderTop: j > 0 ? `1px solid ${C.line}` : "none", fontWeight: 300 }}>
                  {piece}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
