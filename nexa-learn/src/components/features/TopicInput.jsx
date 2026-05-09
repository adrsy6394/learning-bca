import React, { useState } from "react";

import { ArrowRight } from "lucide-react";

// Input form for adding a new topic
const TopicInput = ({ onSubmit }) => {
  const [t, setT] = useState(""); // local state for current input

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // prevent page reload
        if(t.trim()) {
          onSubmit(t); // pass entered topic to parent
          setT(""); // clear input after submit
        }
      }}
      className="relative flex items-center w-full group"
    >
      <input
        value={t} // controlled input value
        onChange={(e) => setT(e.target.value)} // update state on change
        placeholder="Enter a topic to learn..."
        className="w-full px-5 py-4 pr-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 group-hover:border-indigo-300 dark:group-hover:border-indigo-700"
      />
      <button 
        type="submit" 
        disabled={!t.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      >
        <ArrowRight size={20} />
      </button>
    </form>
  );
};

export default TopicInput;
