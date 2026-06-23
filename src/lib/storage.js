const QUIZ_KEY = "le_quiz";
const CHAT_KEY = "le_chat";
const TIER_KEY = "le_tier";

export function loadQuiz() {
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveQuiz(answers, step) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers, step }));
}

export function clearQuiz() {
  localStorage.removeItem(QUIZ_KEY);
}

export function loadChat() {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChat(messages) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

export function clearChat() {
  localStorage.removeItem(CHAT_KEY);
}

export function saveSelectedTier(tier) {
  localStorage.setItem(TIER_KEY, tier);
}

export function loadSelectedTier() {
  return localStorage.getItem(TIER_KEY);
}
