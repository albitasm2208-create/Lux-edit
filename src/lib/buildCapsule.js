import { ATELIERS } from "../data/ateliers.js";

const CATEGORY_IMAGES = {
  blazer: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
  trouser: "https://images.unsplash.com/photo-1594633312681-425a7b956cc9?w=400&h=500&fit=crop",
  shirt: "https://images.unsplash.com/photo-1602810318383-e386cc2c3a9d?w=400&h=500&fit=crop",
  knit: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
  coat: "https://images.unsplash.com/photo-1539533018447-63fcce267634?w=400&h=500&fit=crop",
  dress: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
  shoe: "https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=400&h=500&fit=crop",
  bag: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop",
  accessory: "https://images.unsplash.com/photo-1611591437281-460bf40d6e0e?w=400&h=500&fit=crop",
  default: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=500&fit=crop",
};

function categorize(name) {
  const n = name.toLowerCase();
  if (n.includes("blazer") || n.includes("overshirt")) return "blazer";
  if (n.includes("trouser") || n.includes("denim") || n.includes("skirt")) return "trouser";
  if (n.includes("shirt") || n.includes("tee")) return "shirt";
  if (n.includes("knit") || n.includes("roll-neck") || n.includes("cashmere")) return "knit";
  if (n.includes("coat") || n.includes("trench")) return "coat";
  if (n.includes("slip") || n.includes("column") || n.includes("dress")) return "dress";
  if (n.includes("heel") || n.includes("loafer") || n.includes("flat")) return "shoe";
  if (n.includes("tote") || n.includes("weekender")) return "bag";
  if (n.includes("belt") || n.includes("scarf") || n.includes("signet")) return "accessory";
  return "default";
}

function priceForCategory(category, budget) {
  const tiers = {
    curated: { blazer: "€800–1,200", trouser: "€400–600", shirt: "€200–350", knit: "€500–800", coat: "€1,500–2,500", dress: "€900–1,400", shoe: "€400–700", bag: "€800–1,500", accessory: "€150–400", default: "€300–600" },
    elevated: { blazer: "€1,200–2,000", trouser: "€600–900", shirt: "€350–500", knit: "€800–1,200", coat: "€2,500–4,000", dress: "€1,400–2,200", shoe: "€600–1,000", bag: "€1,500–2,500", accessory: "€250–600", default: "€500–900" },
    investment: { blazer: "€2,000–3,500", trouser: "€900–1,400", shirt: "€500–800", knit: "€1,200–2,000", coat: "€4,000–6,500", dress: "€2,200–3,500", shoe: "€1,000–1,800", bag: "€2,500–4,500", accessory: "€400–900", default: "€800–1,500" },
    open: { blazer: "€1,000–2,500", trouser: "€500–1,000", shirt: "€250–600", knit: "€600–1,500", coat: "€2,000–5,000", dress: "€1,000–2,500", shoe: "€500–1,200", bag: "€1,000–3,000", accessory: "€200–700", default: "€400–1,000" },
  };
  const tier = tiers[budget] || tiers.open;
  return tier[category] || tier.default;
}

function toItem(name, index, budget) {
  const category = categorize(name);
  return {
    name,
    brand: ATELIERS[(index * 2 + 1) % ATELIERS.length],
    category,
    imageUrl: CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default,
    priceRange: priceForCategory(category, budget),
  };
}

export function buildCapsule(a) {
  const palettes = {
    neutral: ["#EDE7DA", "#C9B79C", "#8C7B63", "#3D362C"],
    monochrome: ["#E6E4E1", "#9A9893", "#4A4844", "#161514"],
    warm: ["#D8C7A6", "#A8743F", "#6E5A2E", "#2E2A20"],
    cool: ["#C5CBD0", "#5C6E7A", "#33414C", "#1A2128"],
  };
  const palette = palettes[a.palette] || palettes.neutral;
  const budget = a.budget || "open";

  const base = {
    tailored: ["Double-faced wool blazer", "Straight-leg tailored trouser", "Crisp poplin shirt"],
    fluid: ["Bias-cut silk slip", "Fine cashmere roll-neck", "Wide drape trouser"],
    minimal: ["Boxy crewneck knit", "Clean-line column skirt", "Unadorned cotton shirt"],
    statement: ["Sculptural wool coat", "Quiet-luxury knit", "Tonal tailored trouser"],
  }[a.uniform] || [];

  const lifePieces = {
    boardroom: ["Structured leather tote", "Pointed leather flat"],
    travel: ["Lightweight travel coat", "Soft weekender in calf leather"],
    creative: ["Relaxed denim, raw hem", "Suede loafer"],
    events: ["Floor-length silk column", "Fine strappy heel"],
  }[a.life] || [];

  const seasonPiece = {
    spring: "Featherweight linen overshirt",
    autumn: "Camel-hair wrap coat",
    transitional: "Unlined gabardine trench",
    travel: "Merino travel-set, two pieces",
  }[a.season];

  const rawItems = [...base, ...lifePieces, seasonPiece].filter(Boolean);
  const staples = [
    "White cotton tee, heavyweight",
    "Tonal leather belt",
    "Cashmere-blend scarf",
    "Gold signet, atelier-made",
  ];
  let i = 0;
  while (rawItems.length < 9 && i < staples.length) rawItems.push(staples[i++]);

  const items = rawItems.slice(0, 12).map((name, idx) => toItem(name, idx, budget));

  return { palette, items };
}

export async function buildCapsuleFromCatalog(a) {
  try {
    const res = await fetch("/api/catalog/products");
    const { products, source } = await res.json();
    if (source !== "supabase" || !products?.length) return buildCapsule(a);

    const palette = buildCapsule(a).palette;
    const budget = a.budget || "open";

    const scored = products.map((p) => {
      let score = 0;
      if (p.palette_tags?.includes(a.palette)) score += 3;
      if (p.life_tags?.includes(a.life)) score += 3;
      if (p.season_tags?.includes(a.season)) score += 2;
      if (p.tags?.includes(a.uniform)) score += 2;
      return { ...p, score };
    }).sort((x, y) => y.score - x.score);

    const selected = scored.slice(0, 12).map((p, idx) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      imageUrl: p.image_url,
      priceRange: `€${(p.price_cents / 100).toFixed(0)}`,
      inventoryCount: p.inventory_count,
      productId: p.id,
    }));

    return { palette, items: selected.length >= 9 ? selected : buildCapsule(a).items };
  } catch {
    return buildCapsule(a);
  }
}

export function generateOutfits(items, answers) {
  const names = items.map((it) => it.name);
  const pick = (...keywords) => names.find((n) => keywords.some((k) => n.toLowerCase().includes(k))) || names[0];

  const outfits = [
    {
      title: answers.life === "events" ? "Evening edit" : "Boardroom ready",
      pieces: [pick("blazer", "coat"), pick("trouser", "skirt"), pick("shirt", "knit"), pick("flat", "loafer", "heel")].filter(Boolean),
    },
    {
      title: answers.life === "travel" ? "City to city" : "Everyday ease",
      pieces: [pick("knit", "tee", "overshirt"), pick("trouser", "denim"), pick("coat", "trench"), pick("loafer", "flat")].filter(Boolean),
    },
    {
      title: "Weekend off-duty",
      pieces: [pick("tee", "knit"), pick("denim", "trouser"), pick("scarf", "belt"), pick("loafer", "flat")].filter(Boolean),
    },
  ];

  return outfits.map((o) => ({ ...o, pieces: [...new Set(o.pieces)].slice(0, 4) }));
}
