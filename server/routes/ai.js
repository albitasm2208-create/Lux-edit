import { Router } from "express";
import { callClaude, checkRateLimit, getCachedNote, hashKey, setCachedNote, STYLIST_SYSTEM } from "../lib/ai.js";

const router = Router();

router.post("/stylist-note", async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress;
  if (!checkRateLimit(ip, 10, 3600000)) {
    return res.status(429).json({ error: "Rate limit exceeded." });
  }

  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: "Profile summary is required." });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "Anthropic API key not configured." });

  const cacheKey = hashKey(summary);
  const cached = getCachedNote(cacheKey);
  if (cached) return res.json({ note: cached });

  try {
    const note = await callClaude({
      apiKey: process.env.ANTHROPIC_API_KEY,
      system: STYLIST_SYSTEM,
      messages: [{
        role: "user",
        content: `Write a short, warm note (3-4 sentences, no greeting, no sign-off, no lists) introducing the seasonal capsule for this client. Base it on: ${summary}. Do not use "elevate" or "curated".`,
      }],
      maxTokens: 250,
    });
    setCachedNote(cacheKey, note);
    return res.json({ note });
  } catch (err) {
    console.error("Stylist note error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/stylist-chat", async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress;
  if (!checkRateLimit(ip, 20, 3600000, ":chat")) {
    return res.status(429).json({ error: "Rate limit exceeded." });
  }

  const { messages, profileSummary, capsuleItems } = req.body;
  if (!messages?.length) return res.status(400).json({ error: "Messages are required." });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "Anthropic API key not configured." });

  let system = STYLIST_SYSTEM + " Keep replies to 2-4 sentences unless the client asks for more.";
  if (profileSummary) system += `\n\nClient profile: ${profileSummary}`;
  if (capsuleItems?.length) system += `\n\nCurrent capsule pieces: ${capsuleItems.join(", ")}`;

  const apiMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const reply = await callClaude({
      apiKey: process.env.ANTHROPIC_API_KEY,
      system,
      messages: apiMessages,
      maxTokens: 400,
    });
    return res.json({ reply });
  } catch (err) {
    console.error("Stylist chat error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
