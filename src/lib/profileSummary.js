import { QUESTIONS } from "../data/questions.js";

export function buildProfileSummary(answers) {
  return QUESTIONS.filter((q) => answers[q.id])
    .map((q) => {
      const opt = q.options.find((o) => o.v === answers[q.id]);
      return `${q.label}: ${opt ? opt.t : "—"}`;
    })
    .join("; ");
}

export function seasonName(s) {
  return { spring: "Spring", autumn: "Autumn", transitional: "Transitional", travel: "Travel" }[s] || "Seasonal";
}
