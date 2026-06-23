import Monogram from "./Monogram.jsx";
import { C } from "../lib/colors.js";

export default function ChatMessage({ role, content }) {
  const isStylist = role === "assistant";

  return (
    <div style={{ display: "flex", gap: 12, alignSelf: isStylist ? "flex-start" : "flex-end", flexDirection: isStylist ? "row" : "row-reverse", maxWidth: "100%" }}>
      {isStylist && <Monogram size={28} color={C.gold} />}
      <div className={`le-chat-bubble le-chat-bubble--${isStylist ? "stylist" : "user"}`}>
        {isStylist ? (
          <p className="le-serif" style={{ margin: 0, fontSize: 17, lineHeight: 1.55 }}>{content}</p>
        ) : (
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{content}</p>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="le-typing" aria-label="Stylist is typing">
      <span /><span /><span />
    </div>
  );
}
