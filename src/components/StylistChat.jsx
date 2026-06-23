import { useEffect, useRef } from "react";
import ChatMessage, { TypingIndicator } from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useStylistChat } from "../hooks/useStylistChat.js";
import { SUGGESTED_PROMPTS } from "../lib/stylistPersona.js";
import { useApp } from "../context/AppContext.jsx";
import { C } from "../lib/colors.js";

export default function StylistChat() {
  const { answers } = useApp();
  const { isPremium } = useAuth();
  const { messages, loading, error, sendMessage, clearConversation } = useStylistChat(answers);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const showPrompts = messages.length <= 1 && !loading;

  return (
    <div className="le-chat">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <div>
          <p className="le-eyebrow" style={{ color: C.gold, marginBottom: 8 }}>Your stylist</p>
          <h1 className="le-serif" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 500, margin: 0 }}>Private consult</h1>
        </div>
        <button className="le-link" onClick={clearConversation}>Start fresh</button>
      </div>

      {!isPremium && (
        <p style={{ fontSize: 13, color: "rgba(26,24,21,0.6)", marginBottom: 16 }}>
          Basic stylist chat included. Premium members get fit-aware recommendations and try-on guidance.
        </p>
      )}

      <div className="le-chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
        {loading && <TypingIndicator />}
        {error && <p style={{ color: C.gold, fontSize: 14 }}>{error}</p>}
        <div ref={bottomRef} />
      </div>

      {showPrompts && (
        <div className="le-suggested-prompts">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>{prompt}</button>
          ))}
        </div>
      )}

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
