import React, { useState } from "react";

// Input form for adding a new topic
const TopicInput = ({ onSubmit }) => {
  const [t, setT] = useState(""); // local state for current input

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // prevent page reload
        onSubmit(t); // pass entered topic to parent
        setT(""); // clear input after submit
      }}
      className="flex  flex-col space-y-4"
    >
      <input
        value={t} // controlled input value
        onChange={(e) => setT(e.target.value)} // update state on change
        placeholder="Enter topic"
        className="border border-gray-400 shadow-md p-2 rounded flex-1  dark:text-gray-500"
      />
      <button type="submit" className="bg-green-500 text-white w-16 py-2 rounded ">
        Go
      </button>
    </form>
  );
};

export default TopicInput;
