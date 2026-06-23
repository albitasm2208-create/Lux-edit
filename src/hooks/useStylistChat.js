import { useState, useCallback, useMemo } from "react";
import { loadChat, saveChat, clearChat } from "../lib/storage.js";
import { STYLIST_GREETING } from "../lib/stylistPersona.js";
import { buildProfileSummary } from "../lib/profileSummary.js";
import { buildCapsule } from "../lib/buildCapsule.js";

export function useStylistChat(answers) {
  const [messages, setMessages] = useState(() => {
    const saved = loadChat();
    if (saved.length > 0) return saved;
    return [{ role: "assistant", content: STYLIST_GREETING }];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileSummary = useMemo(() => buildProfileSummary(answers), [answers]);
  const capsuleItems = useMemo(() => (
    Object.keys(answers).length >= 5
      ? buildCapsule(answers).items.map((i) => i.name)
      : []
  ), [answers]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || loading) return;

    const userMsg = { role: "user", content: content.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stylist-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.role === "user" || m.role === "assistant"),
          profileSummary: profileSummary || undefined,
          capsuleItems: capsuleItems.length ? capsuleItems : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      const updated = [...next, { role: "assistant", content: data.reply }];
      setMessages(updated);
      saveChat(updated);
    } catch (e) {
      setError(e.message);
      setMessages(next);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, profileSummary, capsuleItems]);

  const clearConversation = useCallback(() => {
    const fresh = [{ role: "assistant", content: STYLIST_GREETING }];
    setMessages(fresh);
    clearChat();
    saveChat(fresh);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearConversation };
}
