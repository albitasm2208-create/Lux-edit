import { C } from "../lib/colors.js";

export default function ProductCard({ item, index }) {
  return (
    <article className="le-product-card" style={{ background: C.ivory, minHeight: 150, display: "flex", flexDirection: "column" }}>
      <img src={item.imageUrl} alt={item.name} loading="lazy" />
      <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span className="le-serif" style={{ fontSize: 13, color: C.gold }}>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3 className="le-serif" style={{ fontSize: 21, fontWeight: 500, margin: "0 0 6px", lineHeight: 1.15 }}>{item.name}</h3>
          <p className="le-eyebrow" style={{ color: "rgba(26,24,21,0.5)", fontSize: 10, margin: "0 0 4px" }}>{item.brand}</p>
          <p style={{ fontSize: 12, color: "rgba(26,24,21,0.55)", margin: 0 }}>{item.priceRange}</p>
        </div>
      </div>
    </article>
  );
}
