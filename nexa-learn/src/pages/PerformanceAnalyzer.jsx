import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Brain, Loader2, Sparkles } from "lucide-react";

const PerformanceAnalyzer = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([{ subject: "", marks: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";

  const addRow = () => {
    setSubjects([...subjects, { subject: "", marks: "" }]);
  };

  const removeRow = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const handleAnalyze = async () => {
    if (subjects.some(s => !s.subject || !s.marks)) {
      setError("Please fill all subject and marks fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v2/ai/analyze-custom`,
        { subjectsWithMarks: subjects },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to analyze performance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f1a] pt-28 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">AI Performance Analyzer</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Add your subjects and marks to get a personalized AI analysis and a 1-week study strategy.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 sticky top-28 transition-all duration-500">
              <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Performance Analyzer
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Add your subjects & marks for AI analysis</p>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
                {subjects.map((row, index) => (
                  <div key={index} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                    <input
                      type="text"
                      placeholder="Subject name"
                      value={row.subject}
                      onChange={(e) => handleChange(index, "subject", e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 placeholder-slate-400 text-sm font-medium"
                    />
                    <input
                      type="number"
                      placeholder="Marks"
                      value={row.marks}
                      onChange={(e) => handleChange(index, "marks", e.target.value)}
                      className="w-24 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 placeholder-slate-400 text-sm font-medium"
                    />
                    {subjects.length > 1 && (
                      <button 
                        onClick={() => removeRow(index)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addRow}
                className="w-full mb-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center font-medium"
              >
                <Plus size={18} className="mr-2" /> Add Subject
              </button>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <><Loader2 className="mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="mr-2" /> Analyze Performance</>
                )}
              </button>
              {error && <p className="mt-3 text-xs text-red-500 text-center">{error}</p>}
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-3">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Analysis Card */}
                <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                    <Brain className="mr-3 text-indigo-500" /> AI Insights
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {result.weaknesses.map((w, i) => (
                      <span key={i} className="px-4 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full border border-red-100 dark:border-red-800">
                        {w}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-50 dark:border-indigo-800 italic">
                    "{result.analysis}"
                  </p>
                </div>

                {/* 1-Week Study Strategy Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <Sparkles className="mr-3" /> 1-Week Rescue Plan
                  </h3>
                  <div className="grid gap-4">
                    {result.studyPlan.map((day, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-indigo-100 text-sm uppercase tracking-wider">{day.day}</h4>
                            <p className="text-white font-medium">{day.task}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources Card */}
                <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 transition-all duration-500">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Recommended Resources 📚</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.resources.map((res, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <p className="font-bold text-slate-800 dark:text-slate-200 mb-3 truncate">{res.subject}</p>
                        <div className="flex gap-2">
                          <a href={res.youtube} target="_blank" rel="noreferrer" className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[10px] py-2 rounded-xl font-bold text-center transition-all">YouTube</a>
                          <a href={res.google} target="_blank" rel="noreferrer" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] py-2 rounded-xl font-bold text-center transition-all">Google</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[400px] bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center text-center p-8 transition-all duration-500">
                <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-full mb-5">
                  <Brain className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Analysis Results Will Appear Here</h3>
                <p className="text-slate-400 dark:text-slate-500 mt-2 max-w-xs font-medium">Fill in your subject details and let AI design your rescue strategy.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PerformanceAnalyzer;
