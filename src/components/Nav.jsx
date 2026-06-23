import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Monogram from "./Monogram.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function Nav() {
  const { pathname } = useLocation();
  const { i18n, t } = useTranslation();
  const { user } = useAuth();

  const toggleLang = () => {
    const next = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("le_lang", next);
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 28px", background: "rgba(201,194,178,0.82)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
        <Monogram size={30} />
        <span className="le-eyebrow" style={{ letterSpacing: "0.3em" }}>The Luxe Edit</span>
      </Link>
      <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
        <button className="le-link" style={{ border: "none" }} onClick={toggleLang}>{t("nav.lang")}</button>
        <Link to="/stylist" className="le-link" style={{ textDecoration: "none", border: "none", opacity: pathname === "/stylist" ? 1 : 0.6 }}>{t("nav.stylist")}</Link>
        <Link to="/membership" className="le-link" style={{ textDecoration: "none", border: "none", opacity: pathname.startsWith("/membership") ? 1 : 0.6 }}>{t("nav.membership")}</Link>
        <Link to={user ? "/account" : "/login"} className="le-link" style={{ textDecoration: "none", border: "none" }}>{user ? t("nav.account") : t("auth.signIn")}</Link>
        <Link to="/quiz" className="le-btn" style={{ padding: "12px 22px", textDecoration: "none" }}>{t("nav.begin")}</Link>
      </div>
    </nav>
  );
}
