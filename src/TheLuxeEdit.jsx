import { useState, useEffect, useMemo } from "react";

const C = {
  ink: "#1A1815",
  stone: "#C9C2B2",
  taupe: "#A89E8C",
  paper: "#F2EFE8",
  ivory: "#FBFAF6",
  gold: "#9A7B4F",
  line: "rgba(26,24,21,0.14)",
};

function Monogram({ size = 44, color = C.ink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <text
        x="50" y="62"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="600"
        fontSize="66"
        letterSpacing="-6"
        fill={color}
      >LE</text>
    </svg>
  );
}

const QUESTIONS = [
  {
    id: "uniform",
    label: "Your everyday register",
    prompt: "When you get dressed without thinking, what do you reach for?",
    options: [
      { v: "tailored", t: "Tailored & sharp", d: "Structured blazers, clean trousers" },
      { v: "fluid", t: "Fluid & soft", d: "Drape, knitwear, ease of movement" },
      { v: "minimal", t: "Pared-back", d: "Few pieces, no noise, quiet lines" },
      { v: "statement", t: "Considered statement", d: "One bold piece, the rest still" },
    ],
  },
  {
    id: "palette",
    label: "Colour instinct",
    prompt: "Which palette feels most like you?",
    options: [
      { v: "neutral", t: "Stone & camel", d: "Ivory, taupe, espresso" },
      { v: "monochrome", t: "Ink & ash", d: "Black, charcoal, slate" },
      { v: "warm", t: "Warm earth", d: "Olive, cognac, ochre" },
      { v: "cool", t: "Cool depth", d: "Navy, forest, deep grey" },
    ],
  },
  {
    id: "life",
    label: "Where it lives",
    prompt: "What does most of your week ask of your wardrobe?",
    options: [
      { v: "boardroom", t: "Boardrooms & meetings", d: "Polished, authoritative" },
      { v: "travel", t: "Travel between cities", d: "Versatile, crease-resistant" },
      { v: "creative", t: "Studio & creative work", d: "Expressive, comfortable" },
      { v: "events", t: "Dinners & events", d: "Evening-ready, elevated" },
    ],
  },
  {
    id: "value",
    label: "What luxury means to you",
    prompt: "Finish the sentence: a wardrobe is a success when…",
    options: [
      { v: "time", t: "It saves me time", d: "I never think about what to wear" },
      { v: "fit", t: "Everything fits perfectly", d: "Made for my body, no compromise" },
      { v: "sustain", t: "It's fewer, better pieces", d: "Built to last, kinder to the planet" },
      { v: "identity", t: "It looks like me", d: "Intentional, aligned with who I am" },
    ],
  },
  {
    id: "season",
    label: "The season ahead",
    prompt: "Which capsule should we build first?",
    options: [
      { v: "spring", t: "Spring / Summer", d: "Lighter cloth, longer days" },
      { v: "autumn", t: "Autumn / Winter", d: "Layers, outerwear, weight" },
      { v: "transitional", t: "Transitional", d: "Pieces that bridge the year" },
      { v: "travel", t: "A travel capsule", d: "One case, many cities" },
    ],
  },
];

function buildCapsule(a) {
  const palettes = {
    neutral: ["#EDE7DA", "#C9B79C", "#8C7B63", "#3D362C"],
    monochrome: ["#E6E4E1", "#9A9893", "#4A4844", "#161514"],
    warm: ["#D8C7A6", "#A8743F", "#6E5A2E", "#2E2A20"],
    cool: ["#C5CBD0", "#5C6E7A", "#33414C", "#1A2128"],
  };
  const palette = palettes[a.palette] || palettes.neutral;

  const base = {
    tailored: ["Double-faced wool blazer", "Straight-leg tailored trouser", "Crisp poplin shirt"],
    fluid: ["Bias-cut silk slip", "Fine cashmere roll-neck", "Wide drape trouser"],
    minimal: ["Boxy crewneck knit", "Clean-line column skirt", "Unadorned cotton shirt"],
    statement: ["Sculptural wool coat", "Quiet-luxury knit", "Tonal tailored trouser"],
  }[a.uniform] || [];

  const lifePieces = {
    boardroom: ["Structured leather tote", "Pointed leather flat"],
    travel: ["Lightweight travel coat", "Soft weekender in calf leather"],
    creative: ["Relaxed denim, raw hem", "Suede loafer"],
    events: ["Floor-length silk column", "Fine strappy heel"],
  }[a.life] || [];

  const seasonPiece = {
    spring: "Featherweight linen overshirt",
    autumn: "Camel-hair wrap coat",
    transitional: "Unlined gabardine trench",
    travel: "Merino travel-set, two pieces",
  }[a.season];

  const items = [...base, ...lifePieces, seasonPiece].filter(Boolean);

  const staples = [
    "White cotton tee, heavyweight",
    "Tonal leather belt",
    "Cashmere-blend scarf",
    "Gold signet, atelier-made",
  ];
  let i = 0;
  while (items.length < 9 && i < staples.length) items.push(staples[i++]);

  return { palette, items: items.slice(0, 12) };
}

const ATELIERS = ["The Row", "Loro Piana", "Totême", "Gabriela Hearst", "Atelier LE"];

export default function TheLuxeEdit() {
  const [screen, setScreen] = useState("landing");
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [reduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const go = (s) => { setScreen(s); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: C.ink, background: C.stone, minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${C.gold}; color: ${C.ivory}; }
        .le-eyebrow { font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 500; }
        .le-serif { font-family: 'Cormorant Garamond', serif; }
        .le-btn {
          cursor: pointer; border: 1px solid ${C.ink}; background: ${C.ink}; color: ${C.ivory};
          font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500;
          padding: 16px 30px; transition: background .25s, color .25s, transform .25s; border-radius: 0;
        }
        .le-btn:hover { background: transparent; color: ${C.ink}; }
        .le-btn:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 3px; }
        .le-btn--ghost { background: transparent; color: ${C.ink}; }
        .le-btn--ghost:hover { background: ${C.ink}; color: ${C.ivory}; }
        .le-link { background:none;border:none;cursor:pointer;font:inherit;color:${C.ink};
          font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:6px 0;border-bottom:1px solid ${C.ink}; }
        .le-link:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 3px; }
        @keyframes le-rise { from { opacity:0; transform: translateY(16px);} to {opacity:1; transform:none;} }
        @keyframes le-fade { from { opacity:0;} to {opacity:1;} }
        .le-rise { animation: le-rise .7s cubic-bezier(.2,.7,.2,1) both; }
        .le-fade { animation: le-fade 1s ease both; }
        @media (prefers-reduced-motion: reduce){ .le-rise,.le-fade{animation:none!important;} }
        .le-opt:hover { border-color: ${C.ink} !important; }
        .le-opt:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 2px; }
        .le-quiz-options { display: grid; gap: 14px; grid-template-columns: repeat(var(--le-option-count, 4), 1fr); }
        @media (max-width: 768px) {
          .le-quiz-options { grid-template-columns: 1fr; }
        }
        .le-opt { min-height: 120px; }
      `}</style>

      <Nav screen={screen} go={go} />

      {screen === "landing" && <Landing go={go} />}
      {screen === "quiz" && (
        <Quiz
          step={step} setStep={setStep}
          answers={answers} setAnswers={setAnswers}
          onDone={() => go("reveal")}
        />
      )}
      {screen === "reveal" && <Reveal answers={answers} go={go} reduced={reduced} />}
      {screen === "membership" && <Membership go={go} />}

      <Footer />
    </div>
  );
}

function Nav({ screen, go }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 28px", background: "rgba(201,194,178,0.82)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`,
    }}>
      <button onClick={() => go("landing")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer" }}>
        <Monogram size={30} />
        <span className="le-eyebrow" style={{ letterSpacing: "0.3em" }}>The Luxe Edit</span>
      </button>
      <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
        <button className="le-link" style={{ border: "none", opacity: screen === "membership" ? 1 : 0.6 }} onClick={() => go("membership")}>Membership</button>
        <button className="le-btn" style={{ padding: "12px 22px" }} onClick={() => go("quiz")}>Begin</button>
      </div>
    </nav>
  );
}

function Landing({ go }) {
  return (
    <main>
      <section style={{ padding: "clamp(60px,12vw,140px) 28px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <p className="le-eyebrow le-fade" style={{ color: C.gold, marginBottom: 28 }}>A private fashion concierge</p>
        <h1 className="le-serif le-rise" style={{
          fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.02em",
          fontSize: "clamp(48px, 9vw, 124px)", margin: 0, maxWidth: 12 + "ch",
        }}>
          Style is personal. Technology should be too.
        </h1>
        <p className="le-rise" style={{ animationDelay: ".1s", maxWidth: "52ch", marginTop: 34, fontSize: 17, lineHeight: 1.65, color: "rgba(26,24,21,0.78)", fontWeight: 300 }}>
          Bespoke seasonal capsule wardrobes for those who value time, quality, and individuality —
          curated by leading stylists, profiled by intelligent AI, delivered to your door.
        </p>
        <div className="le-rise" style={{ animationDelay: ".2s", marginTop: 44, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button className="le-btn" onClick={() => go("quiz")}>Build your style profile</button>
          <button className="le-btn le-btn--ghost" onClick={() => go("membership")}>View membership</button>
        </div>
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
        <button className="le-btn" onClick={() => go("quiz")}>Begin your edit</button>
      </section>
    </main>
  );
}

function Quiz({ step, setStep, answers, setAnswers, onDone }) {
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const chosen = answers[q.id];

  const pick = (v) => {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < total) setStep(step + 1);
      else onDone();
    }, 260);
  };

  return (
    <main style={{ minHeight: "70vh", padding: "clamp(40px,7vw,90px) 28px", maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 48 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, background: i <= step ? C.ink : "rgba(26,24,21,0.2)", transition: "background .4s" }} />
        ))}
      </div>

      <div key={q.id} className="le-rise">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <p className="le-eyebrow" style={{ color: C.gold }}>{q.label}</p>
          <span className="le-eyebrow" style={{ color: "rgba(26,24,21,0.5)" }}>{String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <h2 className="le-serif" style={{ fontSize: "clamp(28px,4.4vw,46px)", fontWeight: 500, margin: "0 0 40px", letterSpacing: "-0.01em", maxWidth: "20ch" }}>
          {q.prompt}
        </h2>

        <div className="le-quiz-options" style={{ "--le-option-count": q.options.length }}>
          {q.options.map((o) => {
            const active = chosen === o.v;
            return (
              <button
                key={o.v}
                className="le-opt"
                onClick={() => pick(o.v)}
                style={{
                  textAlign: "left", cursor: "pointer", padding: "24px 24px",
                  background: active ? C.ink : C.ivory,
                  color: active ? C.ivory : C.ink,
                  border: `1px solid ${active ? C.ink : C.line}`,
                  transition: "background .25s, color .25s, border-color .25s",
                  borderRadius: 0,
                }}
              >
                <div className="le-serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>{o.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 300, opacity: 0.75 }}>{o.d}</div>
              </button>
            );
          })}
        </div>

        {step > 0 && (
          <button className="le-link" style={{ marginTop: 40 }} onClick={() => setStep(step - 1)}>← Previous</button>
        )}
      </div>
    </main>
  );
}

function Reveal({ answers, go, reduced }) {
  const [phase, setPhase] = useState("curating");
  const [note, setNote] = useState("");
  const [noteState, setNoteState] = useState("loading");
  const capsule = useMemo(() => buildCapsule(answers), [answers]);
  const atelier = ATELIERS[(Object.keys(answers).length + (answers.uniform?.length || 0)) % ATELIERS.length];

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), reduced ? 300 : 2200);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    let cancelled = false;
    async function getNote() {
      const summary = QUESTIONS.map((q) => {
        const opt = q.options.find((o) => o.v === answers[q.id]);
        return `${q.label}: ${opt ? opt.t : "—"}`;
      }).join("; ");
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
          else { setNoteState("error"); }
        }
      } catch {
        if (!cancelled) setNoteState("error");
      }
    }
    getNote();
    return () => { cancelled = true; };
  }, [answers]);

  if (phase === "curating") {
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

      <div style={{ background: C.ivory, border: `1px solid ${C.line}`, padding: "clamp(24px,4vw,40px)", maxWidth: "70ch", margin: "8px 0 48px" }}>
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
            <div key={i} title={c} style={{ width: 40, height: 40, background: c, border: `1px solid ${C.line}` }} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 1, background: C.line, border: `1px solid ${C.line}` }}>
        {capsule.items.map((item, i) => (
          <article key={i} style={{ background: C.ivory, padding: "26px 22px", minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="le-serif" style={{ fontSize: 13, color: C.gold }}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="le-serif" style={{ fontSize: 21, fontWeight: 500, margin: "0 0 6px", lineHeight: 1.15 }}>{item}</h3>
              <p className="le-eyebrow" style={{ color: "rgba(26,24,21,0.5)", fontSize: 10 }}>{ATELIERS[(i * 2 + 1) % ATELIERS.length]}</p>
            </div>
          </article>
        ))}
      </div>

      <p style={{ marginTop: 22, fontSize: 13, color: "rgba(26,24,21,0.6)", fontWeight: 300 }}>
        {capsule.items.length} pieces · sourced from luxury houses including {atelier} · presented for your approval
      </p>

      <div style={{ marginTop: 48, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <button className="le-btn" onClick={() => go("membership")}>Choose your membership</button>
        <button className="le-btn le-btn--ghost" onClick={() => go("quiz")}>Refine your profile</button>
      </div>
    </main>
  );
}

function seasonName(s) {
  return { spring: "Spring", autumn: "Autumn", transitional: "Transitional", travel: "Travel" }[s] || "Seasonal";
}

function Membership({ go }) {
  const tiers = [
    { name: "Essential", price: "€500", per: "/ year", feat: ["AI-powered capsule planning", "Digital wardrobe previews", "Seasonal refresh"], dark: false },
    { name: "Premium", price: "€1,200", per: "/ year", feat: ["Everything in Essential", "Personal stylist consults", "Virtual try-on", "Priority delivery"], dark: true, tag: "Most chosen" },
    { name: "Concierge", price: "€2,500", per: "/ year", feat: ["Everything in Premium", "Full in-home fitting", "Seasonal wardrobe drop", "Luxury event access"], dark: false },
  ];
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
        {tiers.map((t) => (
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
              onClick={() => go("quiz")}
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
      </section>
    </main>
  );
}

function Footer() {
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
