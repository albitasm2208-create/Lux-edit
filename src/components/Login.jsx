import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isSupabaseConfigured } from "../lib/supabase.js";
import { C } from "../lib/colors.js";

export default function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
      return;
    }
    const { error: err } = await signIn(email);
    if (err) setError(err.message);
    else setSent(true);
  };

  return (
    <main style={{ padding: "80px 28px", maxWidth: 480, margin: "0 auto" }}>
      <p className="le-eyebrow" style={{ color: C.gold }}>{t("auth.eyebrow")}</p>
      <h1 className="le-serif" style={{ fontSize: 42, fontWeight: 500, margin: "0 0 24px" }}>{t("auth.title")}</h1>
      {sent ? (
        <p>{t("auth.checkEmail")}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="email" required placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 14, marginBottom: 16, border: `1px solid ${C.line}`, font: "inherit" }} />
          {error && <p style={{ color: C.gold, fontSize: 14 }}>{error}</p>}
          <button type="submit" className="le-btn">{t("auth.signIn")}</button>
        </form>
      )}
      <button className="le-link" style={{ marginTop: 24 }} onClick={() => navigate("/")}>{t("auth.back")}</button>
    </main>
  );
}
