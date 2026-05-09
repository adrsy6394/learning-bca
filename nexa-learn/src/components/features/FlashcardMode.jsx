import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../context/AuthContext";

export const FlashcardMode = ({ cards = [], setCards, semester, subject, unit }) => {
  const [flippedIndices, setFlippedIndices] = useState([]);
  const { markTopicAsLearned } = useContext(AuthContext);

  const toggleFlip = async (index) => {
    const isCurrentlyFlipped = flippedIndices.includes(index);
    
    setFlippedIndices((prev) =>
      isCurrentlyFlipped ? prev.filter((i) => i !== index) : [...prev, index]
    );

    if (!isCurrentlyFlipped && !cards[index].answer) {
      setCards((prev) => prev.map((c, i) => i === index ? { ...c, loading: true } : c));
      
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch(`${import.meta.env.VITE_MAIN_URL}/api/v2/ai/flashcard-answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            topic: cards[index].topic,
            subject: subject,
            semester: semester
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setCards((prev) => prev.map((c, i) => i === index ? { ...c, answer: data.answer, loading: false } : c));
        } else {
          setCards((prev) => prev.map((c, i) => i === index ? { ...c, answer: "Failed to generate answer. Please try again.", loading: false } : c));
        }
      } catch (err) {
        setCards((prev) => prev.map((c, i) => i === index ? { ...c, answer: "Error generating answer. Check your connection.", loading: false } : c));
      }
    }
  };

// Mark a specific card/topic as learned
const handleMarkAsLearned = (index) => {
  const topicName = cards[index]?.topic?.trim(); // get and clean topic name
  if (!topicName || !semester || !subject || !unit) return; // guard: need all context

  // Update local card state to mark it learned
  setCards((prevCards) =>
    prevCards.map((card, i) =>
      i === index ? { ...card, learned: true } : card
    )
  );

  // Update global/context progress for that topic
  markTopicAsLearned(semester, subject, unit, topicName);
};


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 p-4">
      {cards?.map((card, index) => {
        const isFlipped = flippedIndices.includes(index);
        return (
          <motion.div
            key={index}
            className="relative perspective"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div
              className={`relative w-full h-96 transition-transform duration-500 transform-style preserve-3d rounded-xl shadow-md ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={() => toggleFlip(index)}
            >
              {/* FRONT */}
              <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-500">
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-xl font-bold leading-relaxed tracking-tight">
                    {card.topic}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500">
                    Click to flip
                  </p>
                  {card.learned && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black rounded-full uppercase tracking-tighter">
                      Learned
                    </span>
                  )}
                </div>
              </div>

              {/* BACK */}
              <div className="absolute rotate-y-180 backface-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 p-8 w-full h-full rounded-3xl shadow-2xl flex flex-col justify-between transition-all duration-500">
                <div className="mb-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
                    Question
                  </h2>
                  <p className="text-lg font-bold leading-tight">{card.topic}</p>
                </div>

                <div className="overflow-y-auto scrollbar-hide flex-1 pr-2 prose prose-sm dark:prose-invert max-w-full">
                  {card.loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-indigo-500 animate-pulse">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm font-bold">AI is generating answer...</p>
                    </div>
                  ) : (
                    <ReactMarkdown>{card.answer || ""}</ReactMarkdown>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsLearned(index);
                  }}
                  className={`mt-6 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    card.learned
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                  }`}
                >
                  {card.learned ? "✅ Already Learned" : "Mark as Learned"}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
