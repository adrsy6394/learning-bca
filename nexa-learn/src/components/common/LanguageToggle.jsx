import React from 'react';

// Simple dropdown to toggle language selection
const LanguageToggle = ({ value, onChange }) => (
  <div className="relative inline-block w-full group">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 appearance-none cursor-pointer group-hover:border-indigo-300 dark:group-hover:border-indigo-700 font-medium"
    >
      <option value="English" className="bg-white dark:bg-slate-800">English</option>
      <option value="Hindi" className="bg-white dark:bg-slate-800">Hindi</option>
      <option value="Hinglish" className="bg-white dark:bg-slate-800">Hinglish</option>
    </select>
    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);

export default LanguageToggle;
