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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false); // 🔥 important

  /* ================= RESTORE SESSION ================= */
 useEffect(() => {
  let mounted = true;

  const buildUser = (authUser) => {
    if (!authUser) return null;

    const metadataName =
      authUser.user_metadata?.name ||
      authUser.user_metadata?.full_name ||
      "";

    const emailPrefix =
      authUser.email?.split("@")[0] || "User";

    return {
      id: authUser.id,
      email: authUser.email,
      full_name: metadataName || emailPrefix,
    };
  };

  const restoreSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!mounted) return;

    if (session?.user) {
      const userObj = buildUser(session.user);
      setUser(userObj);
    }

    setAuthReady(true);
  };

  restoreSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!mounted) return;

    if (session?.user) {
      const userObj = buildUser(session.user);
      setUser(userObj);
    } else {
      setUser(null);
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);


  /* ================= EMAIL LOGIN ================= */
  const signIn = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }, []);

  /* ================= GOOGLE LOGIN ================= */
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  /* ================= SIGNUP ================= */
  const signUp = useCallback(async ({ email, password, full_name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name,
      });
    }

    return { success: true };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady, // 🔥 must use in route guard
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
