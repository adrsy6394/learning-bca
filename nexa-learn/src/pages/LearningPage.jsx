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
    <div className="min-h-screen transition-all duration-500 bg-[#fdf7e9] pt-28 pb-12">
      
      {/* Header Section */}
      <div className="bg-[#0b2b24] py-16 px-6 text-center relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border border-white/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tighter mb-4">
          AI <span className="text-[#d1e8c4]">LEARNING</span> TUTOR
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light tracking-wide uppercase text-xs tracking-[0.3em]">
          Master BCA concepts with personalized AI explanations
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT PANEL */}
        <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 shadow-2xl border border-[#0b2b24]/5 lg:sticky lg:top-32">
          <h2 className="text-xl font-serif text-[#0b2b24] mb-8 uppercase tracking-widest border-b border-[#0b2b24]/10 pb-4">
            Topic Selection
          </h2>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-2">Quick Topic</label>
              <TopicInput onSubmit={setSelectedTopic} />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-2">Or Custom Topic</label>
              <div className="relative flex items-center w-full group">
                <input
                  value={customTopic}
                  onChange={(e) => {
                    setCustomTopic(e.target.value);
                    setSelectedTopic("");
                  }}
                  placeholder="What's your doubt?"
                  className="w-full px-6 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/10 text-[#0b2b24] font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all placeholder-[#0b2b24]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-2">Language</label>
               <LanguageToggle value={language} onChange={setLanguage} />
            </div>

            <button
              onClick={handleGetExplanation}
              disabled={loading}
              className="w-full bg-[#0b2b24] text-[#d1e8c4] py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 mt-4"
            >
              {loading ? "Generating..." : "Get Explanation"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-[#0b2b24]/5 min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-12 border-b border-[#0b2b24]/10 pb-6">
            <h2 className="text-2xl font-serif text-[#0b2b24] uppercase tracking-widest">
              Explanation
            </h2>
            <div className="px-4 py-1 bg-[#d1e8c4] text-[#0b2b24] rounded-full text-[10px] font-black uppercase tracking-widest">
              AI: {language}
            </div>
          </div>

          {explanation ? (
            <div className="flex-grow flex flex-col">
              <div className="flex-grow text-[#0b2b24] leading-relaxed text-lg">
                <MarkdownRenderer content={typedMarkdown} />
              </div>

              <div className="mt-12 flex justify-center space-x-6 pt-10 border-t border-[#0b2b24]/5">
                {supported && (
                  <button
                    onClick={() => (speaking ? stop() : speak(explanation))}
                    className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
                      speaking ? "bg-[#0b2b24] text-white" : "bg-[#fdf7e9] text-[#0b2b24] hover:bg-[#d1e8c4]"
                    }`}
                  >
                    {speaking ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                )}

                <button
                  onClick={exportToFile}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-[#fdf7e9] text-[#0b2b24] hover:bg-[#d1e8c4] transition-all duration-300 shadow-lg"
                >
                  <FileText size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 bg-[#fdf7e9] rounded-full flex items-center justify-center mb-8">
                 <Brain className="text-[#0b2b24]/20" size={48} />
              </div>
              <p className="text-[#0b2b24]/30 font-serif text-2xl uppercase tracking-[0.2em] max-w-sm">
                Awaiting your topic...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
