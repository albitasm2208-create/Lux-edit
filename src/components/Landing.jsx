import { Link } from "react-router-dom";
import Monogram from "./Monogram.jsx";
import heroImage from "../assets/hero.png";
import { C } from "../lib/colors.js";

export default function Landing() {
  return (
    <main>
      <section style={{ padding: "clamp(60px,12vw,140px) 28px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <p className="le-eyebrow le-fade" style={{ color: C.gold, marginBottom: 28 }}>A private fashion concierge</p>
        <h1 className="le-serif le-rise" style={{
          fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.02em",
          fontSize: "clamp(48px, 9vw, 124px)", margin: 0, maxWidth: "12ch",
        }}>
          Style is personal. Technology should be too.
        </h1>
        <p className="le-rise" style={{ animationDelay: ".1s", maxWidth: "52ch", marginTop: 34, fontSize: 17, lineHeight: 1.65, color: "rgba(26,24,21,0.78)", fontWeight: 300 }}>
          Bespoke seasonal capsule wardrobes for those who value time, quality, and individuality —
          curated by leading stylists, profiled by intelligent AI, delivered to your door.
        </p>
        <div className="le-rise" style={{ animationDelay: ".2s", marginTop: 44, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link to="/quiz" className="le-btn" style={{ textDecoration: "none" }}>Build your style profile</Link>
          <Link to="/stylist" className="le-btn le-btn--ghost" style={{ textDecoration: "none" }}>Speak with your stylist</Link>
          <Link to="/membership" className="le-btn le-btn--ghost" style={{ textDecoration: "none" }}>View membership</Link>
        </div>
        <img src={heroImage} alt="Editorial fashion still life" className="le-hero-image le-fade" />
      </section>

      <section style={{ background: C.ink, color: C.paper, padding: "clamp(56px,8vw,96px) 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 40 }}>What we remove</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 1, background: "rgba(242,239,232,0.16)" }}>
            {[
              ["Decision fatigue", "Too many choices, not enough clarity. We curate, you approve."],
              ["Fit uncertainty", "Profiling and optional in-home tailoring end the trial-and-error."],
              ["Wasted time", "No endless scrolling. A considered capsule arrives each season."],
              ["Overconsumption", "Fewer, better pieces — with trade-in and resale built in."],
            ].map(([h, d], i) => (
              <div key={i} style={{ background: C.ink, padding: "32px 26px" }}>
                <div className="le-serif" style={{ fontSize: 13, color: C.gold, marginBottom: 14 }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 className="le-serif" style={{ fontSize: 26, fontWeight: 500, margin: "0 0 10px" }}>{h}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(242,239,232,0.66)", fontWeight: 300, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(56px,8vw,110px) 28px", maxWidth: 1100, margin: "0 auto" }}>
        <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>The journey</p>
        <h2 className="le-serif" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 500, margin: "0 0 56px", letterSpacing: "-0.01em" }}>
          Five steps, then never a wasted purchase again.
        </h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {[
            ["Profile", "A digital style assessment — or a live consult — reads body, taste, lifestyle, and travel."],
            ["AI × Stylist", "AI drafts the capsule concept; a professional stylist refines every piece by hand."],
            ["Curation", "8–12 versatile luxury pieces, sourced from designer houses and ateliers, presented for approval."],
            ["Delivery & try-on", "Delivered home, with optional in-home tailoring and return pickup included."],
            ["Longevity", "Trade in, tailor, or resell through our sustainable partners. Every capsule is built to last."],
          ].map(([h, d], i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(20px,5vw,60px)", padding: "30px 0", borderTop: `1px solid ${C.line}` }}>
              <span className="le-serif" style={{ fontSize: "clamp(40px,7vw,84px)", color: C.taupe, fontWeight: 400, lineHeight: 0.8 }}>{i + 1}</span>
              <div style={{ alignSelf: "center" }}>
                <h3 className="le-serif" style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 500, margin: "0 0 8px" }}>{h}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(26,24,21,0.74)", fontWeight: 300, margin: 0, maxWidth: "58ch" }}>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section style={{ background: C.taupe, padding: "clamp(56px,8vw,100px) 28px", textAlign: "center" }}>
        <Monogram size={56} />
        <h2 className="le-serif" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 500, margin: "18px auto 26px", maxWidth: "20ch", letterSpacing: "-0.01em" }}>
          Your first capsule begins with a single profile.
        </h2>
        <Link to="/quiz" className="le-btn" style={{ textDecoration: "none" }}>Begin your edit</Link>
      </section>
    </main>
  );
}
