import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/stylist-note", async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ error: "Profile summary is required." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "Anthropic API key not configured." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a discreet, world-class personal stylist for The Luxe Edit, a luxury capsule-wardrobe concierge. Write a short, warm note (3-4 sentences, no greeting, no sign-off, no lists) to a client introducing the seasonal capsule you've curated for them. Quiet-luxury tone — confident, understated, never salesy. Base it on their profile: ${summary}. Reference their instincts naturally. Do not use the words "elevate" or "curated".`,
        }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return res.status(response.status).json({ error: "Failed to generate stylist note." });
    }

    const note = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(" ")
      .trim();

    return res.json({ note });
  } catch (err) {
    console.error("Stylist note error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
