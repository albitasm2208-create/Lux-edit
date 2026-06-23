import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { loadQuiz, saveQuiz, clearQuiz, loadSelectedTier, saveSelectedTier } from "../lib/storage.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const saved = loadQuiz();
  const [answers, setAnswers] = useState(saved?.answers || {});
  const [step, setStep] = useState(saved?.step || 0);
  const [selectedTier, setSelectedTier] = useState(loadSelectedTier() || null);
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (Object.keys(answers).length > 0 || step > 0) {
      saveQuiz(answers, step);
    }
  }, [answers, step]);

  const resetQuiz = useCallback(() => {
    setAnswers({});
    setStep(0);
    clearQuiz();
  }, []);

  const selectTier = useCallback((tier) => {
    setSelectedTier(tier);
    saveSelectedTier(tier);
  }, []);

  return (
    <AppContext.Provider value={{
      answers, setAnswers, step, setStep, resetQuiz,
      selectedTier, selectTier, reduced,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
