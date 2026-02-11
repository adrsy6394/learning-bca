// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

const DEFAULT_USER = { progress: {} };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // ✅ NEW

  /* ---------------- Initial session restore ---------------- */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user ?? null;

        if (mounted && sessionUser) {
          const publicUser = {
            id: sessionUser.id,
            email: sessionUser.email,
            progress:
              (JSON.parse(localStorage.getItem("user")) || {}).progress || {},
          };

          setUser(publicUser);
          localStorage.setItem("user", JSON.stringify(publicUser));
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setAuthLoading(false); // ✅ VERY IMPORTANT
      }
    };

    init();

    /* ---------------- Auth state listener ---------------- */
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sUser = session?.user ?? null;

        if (sUser) {
          const publicUser = {
            id: sUser.id,
            email: sUser.email,
            progress:
              (JSON.parse(localStorage.getItem("user")) || {}).progress || {},
          };

          // OAuth name (Google)
          const fullNameFromOAuth =
            sUser.user_metadata?.full_name ||
            sUser.user_metadata?.name ||
            null;

          // Ensure profile exists
          const { data: profile } = await supabase
            .from("profiles")
            .upsert(
              {
                id: sUser.id,
                full_name: fullNameFromOAuth,
              },
              { onConflict: "id" }
            )
            .select("full_name, student_id")
            .single();

          if (profile) {
            publicUser.full_name = profile.full_name;
            publicUser.studentId = profile.student_id;
          }

          setUser(publicUser);
          localStorage.setItem("user", JSON.stringify(publicUser));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }

        setAuthLoading(false); // ✅ IMPORTANT
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  /* ---------------- Signup ---------------- */
  const signUp = useCallback(async ({ email, password, full_name, studentId }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name,
          student_id: studentId,
        });
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /* ---------------- Login ---------------- */
  const signIn = useCallback(async ({ email, password }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /* ---------------- Logout ---------------- */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  /* ---------------- Progress ---------------- */
  const markTopicAsLearned = useCallback(
    async (semester, subject, unit, topic) => {
      setUser((prev) => {
        const base = prev ? { ...prev } : { ...DEFAULT_USER };
        base.progress ??= {};
        base.progress[semester] ??= {};
        base.progress[semester][subject] ??= {};
        base.progress[semester][subject][unit] ??= [];

        if (!base.progress[semester][subject][unit].includes(topic)) {
          base.progress[semester][subject][unit].push(topic);
        }

        localStorage.setItem("user", JSON.stringify(base));
        return base;
      });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading, // ✅ expose this
        signUp,
        signIn,
        signOut,
        markTopicAsLearned,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
