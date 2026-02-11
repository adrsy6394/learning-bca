import React from 'react';

// Simple dropdown to toggle language selection
const LanguageToggle = ({ value, onChange }) => (
  <select
    value={value} // current selected language
    onChange={e => onChange(e.target.value)} // notify parent about new selection
    className="border border-gray-400 shadow-md p-1 rounded cursor-cell" // basic styling
  >
    <option value="English">English</option>
    <option value="Hindi">Hindi</option>
    <option value="Hinglish">Hinglish</option>
  </select>
);

export default LanguageToggle;
