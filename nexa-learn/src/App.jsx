// src/App.jsx
import React, { useContext } from "react";
import { AuthContext, useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Navigation from "./components/common/Navigation";

import HomePage from "./pages/HomePage";
import LearningPage from "./pages/LearningPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import ProgressPage from "./pages/ProgressPage";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuth();

  if (!authReady) return null; // wait session restore

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, authReady } = useAuth();

  if (!authReady) return null;

  if (user) return <Navigate to="/" replace />;

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
            <ProtectedRoute>
              <>
                <Navigation />
                <HomePage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <LearningPage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <FlashcardsPage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <ProgressPage />
              </>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
