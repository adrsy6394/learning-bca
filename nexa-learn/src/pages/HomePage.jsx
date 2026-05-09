// src/pages/HomePage.jsx
import React, { useContext } from "react";
import { 
  Brain, 
  Languages, 
  Volume2, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Github,
  Instagram,
  Linkedin
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      title: "AI-Powered Learning",
      desc: "Get simplified explanations for complex BCA topics using our advanced Gemini AI.",
      icon: <Brain className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
      link: "/learning"
    },
    {
      title: "Multilingual Support",
      desc: "Learn in English, Hindi, or Hinglish for better conceptual clarity.",
      icon: <Languages className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-600",
      link: "/learning"
    },
    {
      title: "Text-to-Speech",
      desc: "Listen to AI explanations on the go for better retention and focus.",
      icon: <Volume2 className="w-6 h-6" />,
      color: "from-amber-500 to-orange-600",
      link: "/learning"
    },
    {
      title: "Smart Flashcards",
      desc: "Quick revision cards designed to help you master key terms and definitions.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
      link: "/flashcards"
    },
    {
      title: "Progress Tracking",
      desc: "Monitor your learning journey with detailed statistics and completion rates.",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-rose-500 to-red-600",
      link: "/progress"
    },
    {
      title: "AI Performance Analysis",
      desc: "Get AI-driven insights into your weak areas and personalized study rescue plans.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-indigo-600 to-violet-700",
      link: "/analyzer"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0b0f1a] overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-52 pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Next Gen Learning Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Master BCA with <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Precision.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 animate-in fade-in zoom-in-95 duration-1000">
            Hello, <span className="font-bold text-slate-900 dark:text-white">{user?.full_name}</span>. 
            NexaLearn uses Gemini AI to transform complex BCA concepts into simple, understandable insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button 
              onClick={() => navigate("/learning")}
              className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              Start Learning Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate("/progress")}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              Track Progress
            </button>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 relative bg-white dark:bg-[#0d121f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Powerful AI Features</h2>
            <p className="text-slate-500 dark:text-slate-400">Everything you need to excel in your BCA journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i}
                onClick={() => navigate(f.link)}
                className="group relative p-8 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {f.desc}
                </p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  Learn more <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800"></div>
          {/* Decorative mesh */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="relative p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Ready to elevate your study?
            </h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg">
              Join NexaLearn today and experience the future of education powered by AI.
            </p>
            <button 
              onClick={() => navigate("/learning")}
              className="px-10 py-5 bg-white text-indigo-600 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Start For Free
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-24 pb-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img src="/ChatGPT_Image_Jul_20__2025__04_55_44_PM-removebg-preview.png" alt="Logo" className="h-10 w-10 rounded-full" />
                <span className="font-black text-2xl tracking-tighter dark:text-white">NEXALEARN</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                Empowering BCA students with AI-driven insights and personalized learning experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors dark:text-white"><Github size={20} /></a>
                <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors dark:text-white"><Instagram size={20} /></a>
                <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors dark:text-white"><Linkedin size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">Platform</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <li><button onClick={() => navigate("/learning")} className="hover:text-indigo-600 transition-colors">AI Learning</button></li>
                <li><button onClick={() => navigate("/flashcards")} className="hover:text-indigo-600 transition-colors">Flashcards</button></li>
                <li><button onClick={() => navigate("/progress")} className="hover:text-indigo-600 transition-colors">Progress Tracker</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">Company</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-50 dark:border-slate-800 text-slate-400 text-xs">
            © 2025 NexaLearn Platform. All rights reserved. Built for BCA Excellence.
          </div>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
