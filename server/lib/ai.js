import crypto from "crypto";

const noteCache = new Map();
const rateLimits = new Map();

export function hashKey(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function checkRateLimit(ip, limit, windowMs, suffix = "") {
  const key = `${ip}${suffix}`;
  const now = Date.now();
  const entry = rateLimits.get(key) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + windowMs;
  }
  entry.count += 1;
  rateLimits.set(key, entry);
  return entry.count <= limit;
}

export function getCachedNote(key) {
  return noteCache.get(key);
}

export function setCachedNote(key, note) {
  noteCache.set(key, note);
}

export async function callClaude({ apiKey, system, messages, maxTokens = 250 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API error:", data);
      throw new Error("Anthropic request failed");
    }

    return (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(" ")
      .trim();
  } finally {
    clearTimeout(timeout);
  }
}

export const STYLIST_SYSTEM = `You are a discreet, world-class personal stylist for The Luxe Edit, a luxury capsule-wardrobe concierge. Quiet-luxury tone — confident, understated, warm, never salesy. Do not use "elevate" or "curated".`;
