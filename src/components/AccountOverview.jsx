import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AccountOverview() {
  const { profile, tier } = useAuth();

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, fontWeight: 500, margin: "0 0 16px" }}>
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p style={{ marginBottom: 32 }}>Membership: <strong>{tier}</strong></p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link to="/quiz" className="le-btn" style={{ textDecoration: "none" }}>Build new edit</Link>
        <Link to="/account/capsules" className="le-btn le-btn--ghost" style={{ textDecoration: "none" }}>View capsules</Link>
        <Link to="/stylist" className="le-btn le-btn--ghost" style={{ textDecoration: "none" }}>Speak with stylist</Link>
      </div>
    </div>
  );
}
