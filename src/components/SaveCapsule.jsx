import { useState } from "react";
import { buildProfileSummary, seasonName } from "../lib/profileSummary.js";
import { C } from "../lib/colors.js";

export default function SaveCapsule({ answers, capsule }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const summary = buildProfileSummary(answers);

  const downloadEdit = () => {
    const text = `The ${seasonName(answers.season)} Edit\n\n${summary}\n\nPieces:\n${capsule.items.map((it, i) => `${i + 1}. ${it.name} — ${it.brand} (${it.priceRange})`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `luxe-edit-${answers.season || "capsule"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    window.print();
  };

  const shareLink = () => {
    const hash = btoa(JSON.stringify(answers)).replace(/=/g, "");
    const url = `${window.location.origin}/reveal?profile=${hash}`;
    navigator.clipboard?.writeText(url);
    alert("Profile link copied to clipboard.");
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    await fetch("/api/email/send-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, summary, items: capsule.items, season: seasonName(answers.season) }),
    });
    setSent(true);
  };

  return (
    <section style={{ marginTop: 48, padding: "32px", background: C.ivory, border: `1px solid ${C.line}` }}>
      <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 14 }}>Save your edit</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <button className="le-btn" onClick={downloadEdit}>Download edit</button>
        <button className="le-btn le-btn--ghost" onClick={downloadPdf}>Print / PDF</button>
        <button className="le-btn le-btn--ghost" onClick={shareLink}>Copy share link</button>
      </div>
      {!sent ? (
        <form onSubmit={sendEmail} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input type="email" placeholder="Email to receive your edit" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ flex: 1, minWidth: 200, padding: "12px 14px", border: `1px solid ${C.line}`, font: "inherit" }} />
          <button type="submit" className="le-btn le-btn--ghost">Send my edit</button>
        </form>
      ) : (
        <p style={{ margin: 0, fontSize: 14, color: "rgba(26,24,21,0.7)" }}>Your edit has been sent.</p>
      )}
    </section>
  );
}
