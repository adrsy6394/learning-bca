import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../context/AuthContext";

export const FlashcardMode = ({ cards = [], setCards, semester, subject, unit }) => {
  const [flippedIndices, setFlippedIndices] = useState([]);
  const { markTopicAsLearned } = useContext(AuthContext);

 // Toggle flip state for a card by index (add if not flipped, remove if already flipped)
const toggleFlip = (index) => {
  setFlippedIndices((prev) =>
    prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
  );
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
              <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gradient-to-r from-indigo-600 to-purple-600 dark:text-white text-black border p-4 rounded-xl shadow-sm flex flex-col justify-between hover:scale-y-105 transition-scale duration-300">
                <p className="pt-32 font-semibold">📌 {card.topic}</p>
                <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                  Click to flip
                </p>
                {card.learned && (
                  <span className="absolute top-2 right-2 text-green-500 text-xs font-semibold">
                    ✅ Learned
                  </span>
                )}
              </div>

              {/* BACK */}
              <div className="absolute rotate-y-180 backface-hidden bg-green-100 dark:bg-purple-500 text-black dark:text-white border p-4 w-full h-full rounded-xl shadow-sm flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-2 border-b border-gray-300 dark:border-gray-400 pb-1">
                  📌 {card.topic}
                </h2>

                <div className="overflow-y-scroll scrollbar-hide flex-1 pr-2">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          {...props}
                          className="prose prose-sm dark:prose-invert max-w-full"
                        />
                      ),
                    }}
                  >
                    {card.answer}
                  </ReactMarkdown>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card flip
                    handleMarkAsLearned(index);
                  }}
                  className={`mt-4 px-3 py-1 rounded text-sm ${
                    card.learned
                      ? "bg-green-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {card.learned ? "✅ Marked Learned" : "Mark as Learned"}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
