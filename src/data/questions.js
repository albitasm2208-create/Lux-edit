export const QUESTIONS = [
  {
    id: "uniform",
    label: "Your everyday register",
    prompt: "When you get dressed without thinking, what do you reach for?",
    options: [
      { v: "tailored", t: "Tailored & sharp", d: "Structured blazers, clean trousers" },
      { v: "fluid", t: "Fluid & soft", d: "Drape, knitwear, ease of movement" },
      { v: "minimal", t: "Pared-back", d: "Few pieces, no noise, quiet lines" },
      { v: "statement", t: "Considered statement", d: "One bold piece, the rest still" },
    ],
  },
  {
    id: "palette",
    label: "Colour instinct",
    prompt: "Which palette feels most like you?",
    options: [
      { v: "neutral", t: "Stone & camel", d: "Ivory, taupe, espresso" },
      { v: "monochrome", t: "Ink & ash", d: "Black, charcoal, slate" },
      { v: "warm", t: "Warm earth", d: "Olive, cognac, ochre" },
      { v: "cool", t: "Cool depth", d: "Navy, forest, deep grey" },
    ],
  },
  {
    id: "life",
    label: "Where it lives",
    prompt: "What does most of your week ask of your wardrobe?",
    options: [
      { v: "boardroom", t: "Boardrooms & meetings", d: "Polished, authoritative" },
      { v: "travel", t: "Travel between cities", d: "Versatile, crease-resistant" },
      { v: "creative", t: "Studio & creative work", d: "Expressive, comfortable" },
      { v: "events", t: "Dinners & events", d: "Evening-ready, elevated" },
    ],
  },
  {
    id: "value",
    label: "What luxury means to you",
    prompt: "Finish the sentence: a wardrobe is a success when…",
    options: [
      { v: "time", t: "It saves me time", d: "I never think about what to wear" },
      { v: "fit", t: "Everything fits perfectly", d: "Made for my body, no compromise" },
      { v: "sustain", t: "It's fewer, better pieces", d: "Built to last, kinder to the planet" },
      { v: "identity", t: "It looks like me", d: "Intentional, aligned with who I am" },
    ],
  },
  {
    id: "season",
    label: "The season ahead",
    prompt: "Which capsule should we build first?",
    options: [
      { v: "spring", t: "Spring / Summer", d: "Lighter cloth, longer days" },
      { v: "autumn", t: "Autumn / Winter", d: "Layers, outerwear, weight" },
      { v: "transitional", t: "Transitional", d: "Pieces that bridge the year" },
      { v: "travel", t: "A travel capsule", d: "One case, many cities" },
    ],
  },
  {
    id: "budget",
    label: "Investment range",
    prompt: "How do you think about wardrobe investment?",
    optional: true,
    options: [
      { v: "curated", t: "Curated essentials", d: "Quality over quantity, considered spend" },
      { v: "elevated", t: "Elevated core", d: "A strong foundation with room to grow" },
      { v: "investment", t: "Investment pieces", d: "Fewer items, highest craft and cloth" },
      { v: "open", t: "Open to guidance", d: "Let the stylist recommend the right level" },
    ],
  },
  {
    id: "fit",
    label: "Fit preference",
    prompt: "How do you prefer your clothes to sit on the body?",
    optional: true,
    options: [
      { v: "structured", t: "Structured", d: "Clean lines, defined silhouette" },
      { v: "relaxed", t: "Relaxed", d: "Ease and movement, nothing restrictive" },
      { v: "tailored", t: "Tailored to measure", d: "Made for my proportions" },
      { v: "mixed", t: "A mix", d: "Structured where it matters, soft elsewhere" },
    ],
  },
  {
    id: "climate",
    label: "Primary climate",
    prompt: "Where does most of your wardrobe live?",
    optional: true,
    options: [
      { v: "tropical", t: "Tropical & warm", d: "Miami, Singapore, year-round heat" },
      { v: "temperate", t: "Temperate", d: "Four seasons, layering essential" },
      { v: "northern", t: "Northern & cold", d: "Outerwear-forward, weight and warmth" },
      { v: "multi", t: "Multiple cities", d: "I dress for more than one climate" },
    ],
  },
];
