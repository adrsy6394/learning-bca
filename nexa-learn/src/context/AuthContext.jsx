// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(`${API_URL}/api/v2/auth/profile`, config);
          setUser({ ...data, token });
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setAuthReady(true);
    };

    restoreSession();
  }, []);

  /* ================= EMAIL LOGIN ================= */
  const signIn = useCallback(async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/v2/auth/login`, {
        email,
        password,
      });

      setUser(data);
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }, []);

  /* ================= GOOGLE LOGIN ================= */
  const signInWithGoogle = useCallback(async (token, userInfo) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/v2/auth/google`, {
        token,
        userInfo,
      });

      setUser(data);
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Google login failed",
      };
    }
  }, []);

  /* ================= SIGNUP ================= */
  const signUp = useCallback(async ({ email, password, full_name, studentId }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/v2/auth/register`, {
        full_name,
        email,
        studentId,
        password,
      });

      setUser(data);
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  }, []);

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* ================= MARK TOPIC AS LEARNED ================= */
  const markTopicAsLearned = useCallback(
    async (semester, subject, unit, topic) => {
      if (!user) return;

      const currentProgress = JSON.parse(JSON.stringify(user.progress || {}));
      
      if (!currentProgress[semester]) currentProgress[semester] = {};
      if (!currentProgress[semester][subject]) currentProgress[semester][subject] = {};
      if (!currentProgress[semester][subject][unit])
        currentProgress[semester][subject][unit] = [];

      const trimmedTopic = topic.trim();
      if (!currentProgress[semester][subject][unit].includes(trimmedTopic)) {
        currentProgress[semester][subject][unit].push(trimmedTopic);

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.put(
            `${API_URL}/api/v2/auth/progress`,
            { progress: currentProgress },
            config
          );
          
          setUser(prev => ({ ...prev, progress: currentProgress }));
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        markTopicAsLearned,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
