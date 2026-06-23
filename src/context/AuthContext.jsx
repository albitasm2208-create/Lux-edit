import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
    setLoading(false);
  }

  const signIn = (email) => supabase.auth.signInWithOtp({ email });
  const signOut = () => supabase.auth.signOut();

  const tier = profile?.membership_tier || "none";
  const isPremium = ["premium", "concierge"].includes(tier);
  const isConcierge = tier === "concierge";
  const isStylist = profile?.is_stylist === true;

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, tier, isPremium, isConcierge, isStylist, refreshProfile: () => user && loadProfile(user.id) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      profile: null,
      loading: false,
      signIn: async () => ({ error: { message: "Auth not configured" } }),
      signOut: async () => {},
      tier: "none",
      isPremium: false,
      isConcierge: false,
      isStylist: false,
      refreshProfile: () => {},
    };
  }
  return ctx;
}
