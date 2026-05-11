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
    <div className="min-h-screen bg-[#fdf7e9] pt-28 pb-12 transition-all duration-300">
      
      {/* Header Section */}
      <div className="bg-[#0b2b24] py-20 px-6 text-center relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border border-white/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tighter mb-4">
          PERFORMANCE <span className="text-[#d1e8c4]">ANALYZER</span>
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light tracking-wide uppercase text-xs tracking-[0.3em]">
          AI-driven insights to rescue your academic journey
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Input Section */}
        <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 shadow-2xl border border-[#0b2b24]/5 lg:sticky lg:top-32">
          <h2 className="text-xl font-serif text-[#0b2b24] mb-8 uppercase tracking-widest border-b border-[#0b2b24]/10 pb-4">
            Input Marks
          </h2>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
            {subjects.map((row, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Subject"
                  value={row.subject}
                  onChange={(e) => handleChange(index, "subject", e.target.value)}
                  className="flex-1 px-5 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/10 text-[#0b2b24] font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all placeholder-[#0b2b24]/30"
                />
                <input
                  type="number"
                  placeholder="0"
                  value={row.marks}
                  onChange={(e) => handleChange(index, "marks", e.target.value)}
                  className="w-20 px-5 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/10 text-[#0b2b24] font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all placeholder-[#0b2b24]/30 text-center"
                />
                {subjects.length > 1 && (
                  <button 
                    onClick={() => removeRow(index)}
                    className="p-3 text-[#0b2b24]/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="w-full mb-6 py-4 rounded-full border border-dashed border-[#0b2b24]/20 text-[#0b2b24]/40 hover:bg-[#fdf7e9] transition-all flex items-center justify-center font-black text-xs uppercase tracking-widest"
          >
            <Plus size={16} className="mr-2" /> Add Subject
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-[#0b2b24] text-[#d1e8c4] py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <><Loader2 className="mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="mr-2" /> Start Analysis</>
            )}
          </button>
          {error && <p className="mt-4 text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">{error}</p>}
        </div>

        {/* Result Section */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-10">
              
              {/* Analysis Card */}
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#0b2b24]/5">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-[#fdf7e9] rounded-2xl flex items-center justify-center text-[#0b2b24]">
                    <Brain size={28} />
                  </div>
                  <h3 className="text-2xl font-serif text-[#0b2b24] uppercase tracking-widest">
                    AI Insights
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {result.weaknesses.map((w, i) => (
                    <span key={i} className="px-5 py-2 bg-[#d1e8c4] text-[#0b2b24] text-[10px] font-black rounded-full uppercase tracking-widest">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="bg-[#fdf7e9] p-8 rounded-[2rem] border-l-4 border-[#0b2b24] italic text-[#0b2b24] text-lg leading-relaxed">
                  "{result.analysis}"
                </div>
              </div>

              {/* 1-Week Study Strategy Card */}
              <div className="bg-[#0b2b24] rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="text-3xl font-serif text-white mb-12 flex items-center uppercase tracking-widest">
                  <Sparkles className="mr-4 text-[#d1e8c4]" /> 1-Week Rescue Plan
                </h3>
                <div className="grid gap-6">
                  {result.studyPlan.map((day, i) => (
                    <div key={i} className="group bg-white/5 hover:bg-white/10 rounded-[2rem] p-6 border border-white/10 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#d1e8c4] flex flex-col items-center justify-center text-[#0b2b24] group-hover:scale-110 transition-transform">
                          <span className="text-[10px] font-black uppercase">Day</span>
                          <span className="text-2xl font-serif">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[#d1e8c4] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{day.day}</h4>
                          <p className="text-white text-lg font-light leading-snug">{day.task}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Card */}
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#0b2b24]/5">
                 <h3 className="text-xl font-serif text-[#0b2b24] mb-10 uppercase tracking-widest">
                   Recommended Resources
                 </h3>
                 <div className="grid gap-6 sm:grid-cols-2">
                   {result.resources.map((res, i) => (
                     <div key={i} className="p-8 rounded-[2rem] bg-[#fdf7e9] border border-[#0b2b24]/5">
                       <p className="text-lg font-bold text-[#0b2b24] mb-6">{res.subject}</p>
                       <div className="flex gap-3">
                         <a href={res.youtube} target="_blank" rel="noreferrer" className="flex-1 bg-[#0b2b24] text-white text-[10px] py-3 rounded-full font-black text-center uppercase tracking-widest hover:bg-[#d1e8c4] hover:text-[#0b2b24] transition-all">YouTube</a>
                         <a href={res.google} target="_blank" rel="noreferrer" className="flex-1 bg-white text-[#0b2b24] text-[10px] py-3 rounded-full font-black text-center border border-[#0b2b24]/10 uppercase tracking-widest hover:bg-[#d1e8c4] transition-all">Google</a>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-[3rem] border border-[#0b2b24]/5 shadow-2xl flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 bg-[#fdf7e9] rounded-full flex items-center justify-center mb-8">
                 <Brain className="text-[#0b2b24]/20" size={48} />
              </div>
              <h3 className="text-2xl font-serif text-[#0b2b24]/30 uppercase tracking-[0.2em]">Ready For Analysis</h3>
              <p className="text-[#0b2b24]/30 mt-4 max-w-xs font-light text-sm">
                Add your academic records to generate a personalized rescue strategy.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="py-20 bg-[#0b2b24] text-white/40 text-center mt-20">
         <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10">
            <p className="text-xs font-black uppercase tracking-[0.3em]">© 2025 E-STUDY Platform • Premium Education</p>
         </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0b2b24; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PerformanceAnalyzer;
