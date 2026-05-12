import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Play, RotateCcw, Save, Sparkles, Terminal, Code2, ChevronRight, Loader2 } from "lucide-react";
import Footer from "../components/common/Footer";

const NexaCodeIDE = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Welcome to NexaCode IDE\nprint('Hello, NexaLearn!')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { id: "python", name: "Python", version: "3.10.0", defaultCode: "print('Hello, NexaLearn!')" },
    { id: "javascript", name: "JavaScript", version: "18.15.0", defaultCode: "console.log('Hello, NexaLearn!');" },
    { id: "c", name: "C", version: "10.2.0", defaultCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, NexaLearn!\\n\");\n    return 0;\n}" },
    { id: "cpp", name: "C++", version: "10.2.0", defaultCode: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, NexaLearn!\" << std::endl;\n    return 0;\n}" },
    { id: "java", name: "Java", version: "15.0.2", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, NexaLearn!\");\n    }\n}" },
  ];

  const handleLanguageChange = (langId) => {
    const lang = languages.find(l => l.id === langId);
    setLanguage(langId);
    setCode(lang.defaultCode);
    setOutput("");
    setError("");
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    
    try {
      const langData = languages.find(l => l.id === language);
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: langData.id,
        version: langData.version,
        files: [{ content: code }],
      });

      const { run } = response.data;
      if (run.stderr) {
        setError(run.stderr);
      } else {
        setOutput(run.output || "Program executed successfully (no output).");
      }
    } catch (err) {
      setError("Execution failed. Please check your internet connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7e9] pt-28 transition-all duration-300 flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="bg-[#0b2b24] py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d1e8c4]/5 rounded-full blur-3xl"></div>
        <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter mb-2">
          Nexa<span className="text-[#d1e8c4]">Code</span> IDE
        </h1>
        <p className="text-[#d1e8c4]/60 text-xs font-black uppercase tracking-[0.4em]">Integrated Development Environment</p>
      </div>

      {/* IDE CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 lg:p-10 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* SIDEBAR: LANGUAGE SELECTION */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-[#0b2b24]/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0b2b24]/40 mb-6 px-2">Select Language</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    language === lang.id 
                      ? "bg-[#0b2b24] text-[#d1e8c4] shadow-lg shadow-[#0b2b24]/20" 
                      : "bg-[#fdf7e9]/50 text-[#0b2b24]/60 hover:bg-[#d1e8c4]/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Code2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">{lang.name}</span>
                  </div>
                  {language === lang.id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0b2b24] rounded-[2rem] p-8 text-center text-[#d1e8c4] relative overflow-hidden shadow-2xl">
             <Sparkles className="mx-auto mb-4 opacity-50" size={32} />
             <h4 className="font-serif text-lg mb-2">AI Assistant</h4>
             <p className="text-[10px] font-light opacity-60 leading-relaxed mb-6 uppercase tracking-wider">Get help with your code logic and debugging instantly.</p>
             <button className="w-full py-3 bg-[#d1e8c4] text-[#0b2b24] rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Ask Nexa AI</button>
          </div>
        </div>

        {/* MAIN EDITOR AREA */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* EDITOR CARD */}
          <div className="bg-[#0b2b24] rounded-[3rem] p-4 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d1e8c4]/40 ml-4">main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCode(languages.find(l => l.id === language).defaultCode)}
                  className="p-3 text-[#d1e8c4]/40 hover:text-[#d1e8c4] transition-all rounded-full hover:bg-white/5" title="Reset Code">
                  <RotateCcw size={18} />
                </button>
                <button className="p-3 text-[#d1e8c4]/40 hover:text-[#d1e8c4] transition-all rounded-full hover:bg-white/5" title="Save File">
                  <Save size={18} />
                </button>
                <button 
                  onClick={runCode}
                  disabled={loading}
                  className="px-8 py-3 bg-[#d1e8c4] text-[#0b2b24] rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                  Run Code
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 py-4">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                  fontFamily: "'Fira Code', monospace",
                  fontLigatures: true,
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling: true,
                  lineNumbers: "on",
                  roundedSelection: true,
                }}
                loading={<Loader2 className="animate-spin text-[#d1e8c4]" />}
              />
            </div>
          </div>

          {/* OUTPUT CONSOLE */}
          <div className="bg-white rounded-[3rem] shadow-2xl border border-[#0b2b24]/5 overflow-hidden flex flex-col min-h-[250px]">
             <div className="px-8 py-5 border-b border-[#0b2b24]/5 flex items-center justify-between bg-[#fdf7e9]/50">
               <div className="flex items-center gap-3 text-[#0b2b24]">
                 <Terminal size={18} />
                 <h3 className="text-[10px] font-black uppercase tracking-widest">Console Output</h3>
               </div>
               <button onClick={() => setOutput("")} className="text-[10px] font-black uppercase tracking-widest text-[#0b2b24]/20 hover:text-[#0b2b24] transition-all">Clear</button>
             </div>
             <div className="flex-1 p-8 font-mono text-sm overflow-y-auto bg-slate-950 text-emerald-400 custom-scrollbar">
                {loading ? (
                   <div className="flex items-center gap-2 opacity-50 italic">
                      <Loader2 size={14} className="animate-spin" />
                      Executing your code...
                   </div>
                ) : error ? (
                   <div className="text-red-400">
                      <span className="font-bold uppercase text-[10px] bg-red-400/10 px-2 py-0.5 rounded mr-2">Error</span>
                      {error}
                   </div>
                ) : output ? (
                   <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                   <div className="text-[#d1e8c4]/20 italic">Run your code to see the output here...</div>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1e8c4; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NexaCodeIDE;
