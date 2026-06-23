import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../data/questions.js";
import { useApp } from "../context/AppContext.jsx";
import { C } from "../lib/colors.js";

export default function Quiz() {
  const navigate = useNavigate();
  const { answers, setAnswers, step, setStep } = useApp();
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const chosen = answers[q.id];

  const pick = (v) => {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < total) setStep(step + 1);
      else navigate("/reveal");
    }, 260);
  };

  const skip = () => {
    if (step + 1 < total) setStep(step + 1);
    else navigate("/reveal");
  };

  return (
    <main style={{ minHeight: "70vh", padding: "clamp(40px,7vw,90px) 28px", maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 48 }} role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, background: i <= step ? C.ink : "rgba(26,24,21,0.2)", transition: "background .4s" }} />
        ))}
      </div>

      <div key={q.id} className="le-rise" aria-live="polite">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <p className="le-eyebrow" style={{ color: C.gold }}>{q.label}{q.optional ? " (optional)" : ""}</p>
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
                aria-label={`${o.t}: ${o.d}`}
                aria-pressed={active}
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

        <div style={{ marginTop: 40, display: "flex", gap: 24 }}>
          {step > 0 && (
            <button className="le-link" onClick={() => setStep(step - 1)}>← Previous</button>
          )}
          {q.optional && (
            <button className="le-link" onClick={skip}>Skip</button>
          )}
        </div>
      </div>
    </main>
  );
}
