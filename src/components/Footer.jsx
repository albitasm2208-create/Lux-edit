import Monogram from "./Monogram.jsx";
import { C } from "../lib/colors.js";

export default function Footer() {
  return (
    <footer style={{ background: C.ink, color: C.paper, padding: "60px 28px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 30 }}>
        <div>
          <Monogram size={40} color={C.paper} />
          <p className="le-serif" style={{ fontSize: 26, fontWeight: 500, margin: "12px 0 0", maxWidth: "16ch" }}>Luxury made smarter. Style made simpler.</p>
        </div>
        <div style={{ fontSize: 12, color: "rgba(242,239,232,0.55)", fontWeight: 300, lineHeight: 1.8 }}>
          <p style={{ margin: 0 }}>The Luxe Edit — a concept by Alba Sanchez Martinez</p>
          <p style={{ margin: 0 }}>AI-curated capsule wardrobes for the luxury consumer</p>
        </div>
      </div>
    </footer>
  );
}
