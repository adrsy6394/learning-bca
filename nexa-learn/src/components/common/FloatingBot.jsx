import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import MarkdownRenderer from "../features/MarkdownRenderer";

const FloatingBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm **Nexa AI**. How can I help you with your BCA syllabus or academic performance today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const config = user?.token 
        ? { headers: { Authorization: `Bearer ${user.token}` } } 
        : {};

      const { data } = await axios.post(`${API_URL}/api/v2/chatbot/query`, {
        message: userMsg
      }, config);

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[350px] sm:w-[450px] h-[600px] bg-[#fdf7e9] rounded-[2.5rem] shadow-[0_30px_100px_rgba(11,43,36,0.2)] border border-[#0b2b24]/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
          {/* Header */}
          <div className="p-6 bg-[#0b2b24] text-[#d1e8c4] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#d1e8c4]/10 rounded-full flex items-center justify-center">
                <Bot size={22} className="text-[#d1e8c4]" />
              </div>
              <div>
                <h3 className="font-serif text-lg tracking-tight">Nexa AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Online | Powered by RAG</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/50 backdrop-blur-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] p-4 rounded-3xl text-sm transition-all duration-300 ${
                  msg.role === "user" 
                    ? "bg-[#0b2b24] text-[#d1e8c4] rounded-tr-none shadow-lg shadow-[#0b2b24]/10 font-bold" 
                    : "bg-white text-[#0b2b24] shadow-sm border border-[#0b2b24]/5 rounded-tl-none"
                }`}>
                  {msg.role === "assistant" ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#0b2b24]/5 rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#0b2b24]/20 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#0b2b24]/20 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#0b2b24]/20 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 bg-white border-t border-[#0b2b24]/5 flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about NexaLearn..."
              className="flex-1 px-6 py-4 bg-[#fdf7e9]/50 border border-[#0b2b24]/5 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#d1e8c4] transition-all placeholder-[#0b2b24]/30 font-medium"
            />
            <button 
              disabled={loading || !input.trim()}
              className="w-12 h-12 flex items-center justify-center bg-[#0b2b24] text-[#d1e8c4] rounded-full hover:scale-110 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-[#0b2b24]/10"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 ${
          isOpen ? "bg-white text-[#0b2b24] rotate-90" : "bg-[#0b2b24] text-[#d1e8c4]"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default FloatingBot;
