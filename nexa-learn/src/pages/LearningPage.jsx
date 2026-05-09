// src/pages/LearningPage.jsx

import React, { useState, useContext } from "react";
import { Brain, Play, Pause, FileText } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import TopicInput from "../components/features/TopicInput";
import LanguageToggle from "../components/common/LanguageToggle";

import { useTextToSpeech } from "../components/common/useTextToSpeech";
import { useTypedMarkdown } from "../components/common/useTypedMarkdown";
import MarkdownRenderer from "../components/features/MarkdownRenderer";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import Button from "../components/ui/button";
import Input from "../components/ui/input";

const LearningPage = () => {
  const { user } = useContext(AuthContext);

  const [selectedSubject, setSelectedSubject] = useState("General");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const { speak, stop, speaking, supported } = useTextToSpeech();
  const typedMarkdown = useTypedMarkdown(explanation, 5);

  // ✅ Fetch explanation
  const handleGetExplanation = async () => {
    const topic = customTopic || selectedTopic;

    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setExplanation("");

      const response = await fetch(
        `${import.meta.env.VITE_MAIN_URL}/api/v2/chatbot/explain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedSubject,
            selectedTopic,
            customTopic,
            language,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate explanation");
      }

      setExplanation(data.reply || "No explanation generated");
    } catch (error) {
      console.error("Frontend Error 👉", error);
      setExplanation("⚠️ Failed to generate explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export explanation as text file
  const exportToFile = () => {
    if (!explanation) return;

    const content = `
Subject: ${selectedSubject}
Topic: ${customTopic || selectedTopic}
Language: ${language}

Explanation:
${explanation}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSubject}_${customTopic || selectedTopic}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen transition-all duration-500
    bg-white
    dark:bg-[#0B1C2D] 
    text-gray-900 dark:text-white 
    pt-28 pb-12 "
    >
      <div className="max-w-full mx-auto md:px-6 p-2 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT PANEL */}
        <div
          className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500 sticky top-28"
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Select Your Topic
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
            Choose a topic for personalized explanation
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm mb-2">Topic</label>
              <TopicInput onSubmit={setSelectedTopic} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-sm mb-2">Or Custom Topic</label>
              <div className="relative flex items-center w-full group">
                <Input
                  value={customTopic}
                  onChange={(e) => {
                    setCustomTopic(e.target.value);
                    setSelectedTopic("");
                  }}
                  placeholder="Enter your specific doubt..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 group-hover:border-indigo-300 dark:group-hover:border-indigo-700"
                />
              </div>
            </div>

            <div>
              <LanguageToggle value={language} onChange={setLanguage} />
            </div>

            <button
              onClick={handleGetExplanation}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50"
            >
              {loading ? "Generating..." : "Get Explanation"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500"
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
            AI Explanation
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-center font-medium">
            Personalized in {language}
          </p>

          {explanation ? (
            <>
              <div
                className="bg-white/95 dark:bg-gray-900
              text-gray-900 dark:text-white
              p-6 rounded-xl shadow-lg transition-all duration-300"
              >
                <MarkdownRenderer content={typedMarkdown} />
              </div>

              <div className="mt-6 flex justify-center space-x-6">
                {supported && (
                  <button
                    onClick={() => (speaking ? stop() : speak(explanation))}
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white p-4 rounded-2xl transition-all duration-300 shadow-sm"
                  >
                    {speaking ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                )}

                <button
                  onClick={exportToFile}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white p-4 rounded-2xl transition-all duration-300 shadow-sm"
                >
                  <FileText className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center 
            text-gray-200 py-16"
            >
              <Brain className="w-14 h-14 mb-6 text-gray-300 animate-pulse" />
              <p className="text-lg opacity-80 text-center">
                Select a topic and language to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
