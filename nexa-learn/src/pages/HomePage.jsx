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
import Footer from "../components/common/Footer";

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
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 bg-[#0b2b24] overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-12 h-12 border border-white/10 rounded-lg rotate-12"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 border border-white/10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tight leading-tight mb-12 uppercase">
            EMPOWERING <span className="text-[#d1e8c4]">BCA STUDENTS</span> <br />
            WITH AI LEARNING
          </h1>

          <div className="flex justify-center mb-20">
            <button 
              onClick={() => navigate("/flashcards")}
              className="flex items-center space-x-3 px-10 py-4 bg-[#d1e8c4] text-[#0b2b24] rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl"
            >
              <span>Start A Course</span>
              <div className="w-8 h-8 bg-[#0b2b24] text-white rounded-full flex items-center justify-center">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          {/* Hero Images with Decorative Line */}
          <div className="relative mt-20 max-w-5xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -z-10"></div>
            <div className="grid grid-cols-3 gap-4 md:gap-8 items-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
                <img src="/hero1.png" alt="Student" className="w-full h-auto object-cover aspect-[4/5]" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl transform translate-y-8 hover:translate-y-4 transition-transform duration-500 border-4 border-white/10">
                <img src="/hero2.png" alt="Learning" className="w-full h-auto object-cover aspect-[3/4]" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
                <img src="/hero3.png" alt="Education" className="w-full h-auto object-cover aspect-[4/5]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-[#fdf7e9] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { val: "20K+", label: "Students" },
              { val: "70+", label: "Instructors" },
              { val: "250+", label: "Subjects" },
              { val: "30+", label: "Awards" },
              { val: "10+", label: "Years" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#d1e8c4] border-2 border-[#0b2b24]/10 flex flex-col items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                  <span className="text-xl md:text-2xl font-black text-[#0b2b24]">{stat.val}</span>
                  <span className="text-[10px] md:text-xs font-bold text-[#0b2b24]/60 uppercase tracking-widest">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-32 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif text-[#0b2b24] mb-8 leading-tight">
                WHY CHOOSE US?
              </h2>
              <p className="text-lg text-[#0b2b24]/70 leading-relaxed mb-12 max-w-xl">
                Unlocking our wealth of knowledge and experience to deliver unmatched solutions tailored to your needs.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: "Best Tutors", icon: <Brain size={24} />, desc: "Unlocking academic excellence with the finest tutors." },
                  { title: "Best Curriculum", icon: <Sparkles size={24} />, desc: "Perfect path with the best curriculum for lifelong learning." },
                  { title: "Certicate", icon: <FileText size={24} />, desc: "Recognizing proficiency and achievement with official certificates." },
                  { title: "Best Price", icon: <CreditCard size={24} />, desc: "Unbeatable deals and unmatched value for your ideal purchase." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6 group">
                    <div className="w-14 h-14 rounded-full border border-[#0b2b24]/20 flex items-center justify-center text-[#0b2b24] group-hover:bg-[#0b2b24] group-hover:text-white transition-all duration-300 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#0b2b24] mb-1">{item.title}</h4>
                      <p className="text-[#0b2b24]/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src="/hero2.png" alt="Why us" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d1e8c4] rounded-full -z-10 blur-2xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0b2b24] mb-6">OUR PREMIUM SERVICES</h2>
            <div className="w-24 h-1 bg-[#d1e8c4] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div 
                key={i}
                onClick={() => navigate(f.link)}
                className="group p-10 bg-white border border-[#0b2b24]/5 rounded-[2rem] hover:bg-[#0b2b24] transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[#0b2b24]/20"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#fdf7e9] flex items-center justify-center text-[#0b2b24] mb-8 group-hover:bg-[#d1e8c4] transition-colors duration-500">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#0b2b24] group-hover:text-white mb-4 transition-colors">{f.title}</h3>
                <p className="text-[#0b2b24]/60 group-hover:text-white/70 text-sm leading-relaxed mb-8 transition-colors">
                  {f.desc}
                </p>
                <div className="flex items-center text-[#0b2b24] group-hover:text-[#d1e8c4] font-black text-xs uppercase tracking-widest transition-colors">
                  Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto relative rounded-[4rem] overflow-hidden bg-[#0b2b24] py-24 text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d1e8c4] rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10 px-6">
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight uppercase">
              Ready to <span className="text-[#d1e8c4]">Elevate</span> <br />
              Your Study?
            </h2>
            <p className="text-white/70 mb-12 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide">
              Join thousands of BCA students mastering complex concepts with NexaLearn's premium AI platform.
            </p>
            <button 
              onClick={() => navigate("/learning")}
              className="px-12 py-5 bg-[#d1e8c4] text-[#0b2b24] rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Start For Free
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

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
