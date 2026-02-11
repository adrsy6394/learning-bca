import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Navigation from "./components/common/Navigation";

import HomePage from "./pages/HomePage";
import LearningPage from "./pages/LearningPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import ProgressPage from "./pages/ProgressPage";

const FullScreenLoader = () => (
  <div className="h-screen flex items-center justify-center">Loading…</div>
);

const PublicRoute = ({ children }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) return <FullScreenLoader />;

  if (user && user.id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) return <FullScreenLoader />;

  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpForm />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <>
              <Navigation />
              <HomePage />
            </>
          }
        />

        <Route
          path="/learning"
          element={
            <>
              <Navigation />
              <LearningPage />
            </>
          }
        />

        <Route
          path="/flashcards"
          element={
            <>
              <Navigation />
              <FlashcardsPage />
            </>
          }
        />

        <Route
          path="/progress"
          element={
            <>
              <Navigation />
              <ProgressPage />
            </>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
