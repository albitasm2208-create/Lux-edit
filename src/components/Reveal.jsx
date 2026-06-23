import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Monogram from "./Monogram.jsx";
import ProductCard from "./ProductCard.jsx";
import OutfitCombinations from "./OutfitCombinations.jsx";
import SaveCapsule from "./SaveCapsule.jsx";
import BookConsult from "./BookConsult.jsx";
import { QUESTIONS } from "../data/questions.js";
import { buildCapsule, buildCapsuleFromCatalog, generateOutfits } from "../lib/buildCapsule.js";
import { buildProfileSummary, seasonName } from "../lib/profileSummary.js";
import { ATELIERS } from "../data/ateliers.js";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";
import { C } from "../lib/colors.js";

export default function Reveal() {
  const navigate = useNavigate();
  const { answers, resetQuiz, reduced } = useApp();
  const { user } = useAuth();
  const [phase, setPhase] = useState("curating");
  const [note, setNote] = useState("");
  const [noteState, setNoteState] = useState("loading");
  const [showConsult, setShowConsult] = useState(false);
  const [capsule, setCapsule] = useState(null);
  const savedCapsuleRef = useRef(false);

  const outfits = useMemo(() => capsule ? generateOutfits(capsule.items, answers) : [], [capsule, answers]);
  const atelier = ATELIERS[(Object.keys(answers).length + (answers.uniform?.length || 0)) % ATELIERS.length];
  const summary = buildProfileSummary(answers);

  useEffect(() => {
    if (!answers.uniform && !answers.season) navigate("/quiz");
  }, [answers, navigate]);

  useEffect(() => {
    buildCapsuleFromCatalog(answers).then(setCapsule);
  }, [answers]);

  useEffect(() => {
    if (!capsule || !user || !isSupabaseConfigured() || savedCapsuleRef.current) return;
    savedCapsuleRef.current = true;
    (async () => {
      const { data: profile } = await supabase.from("style_profiles").insert({
        user_id: user.id,
        answers,
        summary,
      }).select().single();
      await fetch("/api/catalog/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          season: answers.season,
          styleProfileId: profile?.id,
          status: "pending_review",
          items: capsule.items.filter((i) => i.productId).map((i) => ({ productId: i.productId })),
        }),
      });
    })();
  }, [capsule, user, answers, summary]);

  useEffect(() => {
    let cancelled = false;
    async function getNote() {
      try {
        const res = await fetch("/api/stylist-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary }),
        });
        const data = await res.json();
        const text = data.note?.trim() || "";
        if (!cancelled) {
          if (text) { setNote(text); setNoteState("ready"); }
          else setNoteState("error");
        }
      } catch {
        if (!cancelled) setNoteState("error");
      }
    }
    getNote();
    return () => { cancelled = true; };
  }, [summary]);

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), reduced ? 300 : 2200);
    return () => clearTimeout(t);
  }, [reduced]);

  const handleRefine = () => {
    resetQuiz();
    navigate("/quiz");
  };

  if (phase === "curating" || !capsule) {
    return (
      <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "60px 28px", textAlign: "center" }}>
        <div className="le-fade">
          <Monogram size={60} />
          <p className="le-serif" style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 500, marginTop: 22 }}>Curating your edit…</p>
          <p className="le-eyebrow" style={{ color: C.gold, marginTop: 10 }}>AI profiling · stylist refinement</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "clamp(40px,7vw,90px) 28px", maxWidth: 1100, margin: "0 auto" }} className="le-fade">
      <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>Your seasonal capsule</p>
      <h1 className="le-serif" style={{ fontSize: "clamp(34px,6vw,72px)", fontWeight: 500, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
        The {seasonName(answers.season)} Edit
      </h1>

      <div style={{ background: C.ivory, border: `1px solid ${C.line}`, padding: "clamp(24px,4vw,40px)", maxWidth: "70ch", margin: "8px 0 48px" }} aria-live="polite">
        <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 16 }}>A note from your stylist</p>
        {noteState === "loading" && <p style={{ fontStyle: "italic", color: "rgba(26,24,21,0.5)", margin: 0 }}>Writing your note…</p>}
        {noteState === "ready" && <p className="le-serif" style={{ fontSize: "clamp(18px,2.4vw,24px)", lineHeight: 1.5, fontWeight: 400, margin: 0 }}>{note}</p>}
        {noteState === "error" && (
          <p className="le-serif" style={{ fontSize: "clamp(18px,2.4vw,24px)", lineHeight: 1.5, fontWeight: 400, margin: 0 }}>
            We&apos;ve built this season around your instinct for {(QUESTIONS[0].options.find(o => o.v === answers.uniform) || {}).t?.toLowerCase() || "considered dressing"} — fewer pieces, each one earning its place. Everything here is made to move between your days without a second thought.
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <span className="le-eyebrow">Your palette</span>
        <div style={{ display: "flex", gap: 8 }}>
          {capsule.palette.map((c, i) => (
            <div key={i} title={c} className="le-palette-swatch" style={{ width: 40, height: 40, background: c, border: `1px solid ${C.line}`, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 1, background: C.line, border: `1px solid ${C.line}` }}>
        {capsule.items.map((item, i) => (
          <ProductCard key={i} item={item} index={i} />
        ))}
      </div>

      <p style={{ marginTop: 22, fontSize: 13, color: "rgba(26,24,21,0.6)", fontWeight: 300 }}>
        {capsule.items.length} pieces · sourced from luxury houses including {atelier} · presented for your approval
      </p>

      <OutfitCombinations outfits={outfits} />
      <SaveCapsule answers={answers} capsule={capsule} />

      <div style={{ marginTop: 48, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link to="/membership" className="le-btn" style={{ textDecoration: "none" }}>Choose your membership</Link>
        <Link to="/stylist" className="le-btn le-btn--ghost" style={{ textDecoration: "none" }}>Ask your stylist about this edit</Link>
        <button className="le-btn le-btn--ghost" onClick={() => setShowConsult(true)}>Book a consult</button>
        <button className="le-link" onClick={handleRefine}>Refine your profile</button>
      </div>

      {showConsult && <BookConsult onClose={() => setShowConsult(false)} tier={null} />}
    </main>
  );
}
