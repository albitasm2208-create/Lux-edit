import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../lib/colors.js";

export default function AccountLayout() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="le-loading">Loading…</div>;

  if (!user) {
    return (
      <main style={{ padding: "80px 28px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <p className="le-serif" style={{ fontSize: 28, marginBottom: 24 }}>Sign in to access your account</p>
        <Link to="/login" className="le-btn" style={{ textDecoration: "none" }}>Sign in</Link>
      </main>
    );
  }

  const links = [
    ["/account", "Overview"],
    ["/account/capsules", "My capsules"],
    ["/account/membership", "Membership"],
    ["/account/fitting", "In-home fitting"],
    ["/account/returns", "Returns"],
    ["/account/trade-in", "Trade-in"],
    ["/account/alterations", "Alterations"],
    ["/account/events", "Events"],
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, padding: "60px 28px", maxWidth: 1100, margin: "0 auto" }}>
      <aside>
        <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 8 }}>Account</p>
        <p style={{ fontSize: 14, marginBottom: 24 }}>{profile?.email || user.email}</p>
        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {links.map(([to, label]) => (
            <Link key={to} to={to} style={{ color: C.ink, textDecoration: "none", fontSize: 14 }}>{label}</Link>
          ))}
          {profile?.is_stylist && <Link to="/admin" style={{ color: C.gold, fontSize: 14 }}>Admin portal</Link>}
        </nav>
        <button className="le-link" style={{ marginTop: 32 }} onClick={() => { signOut(); navigate("/"); }}>Sign out</button>
      </aside>
      <div><Outlet /></div>
    </div>
  );
}
