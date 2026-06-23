import { useAuth } from "../context/AuthContext.jsx";

export default function ConciergeEvents() {
  const { isConcierge } = useAuth();

  if (!isConcierge) {
    return <p>Concierge membership includes access to luxury event styling and private previews.</p>;
  }

  return (
    <div>
      <h1 className="le-serif" style={{ fontSize: 36, margin: "0 0 16px" }}>Luxury events</h1>
      <p style={{ maxWidth: "50ch", lineHeight: 1.6 }}>
        As a Concierge member, you have access to private trunk shows, fashion-week preparation,
        and gala styling. Contact your stylist to reserve your place at upcoming events.
      </p>
      <a href="/stylist" className="le-btn" style={{ display: "inline-block", marginTop: 24, textDecoration: "none" }}>Contact stylist</a>
    </div>
  );
}
