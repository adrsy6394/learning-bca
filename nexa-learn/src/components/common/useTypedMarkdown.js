// hooks/useTypedMarkdown.js
import { useEffect, useState } from "react";

// Hook that types out given markdown string one character at a time
export const useTypedMarkdown = (markdown = "", delay = 5) => {
  const [typedMarkdown, setTypedMarkdown] = useState(""); // progressively built string

  useEffect(() => {
    if (!markdown) return; // nothing to type if empty

    let currentIndex = 0;
    setTypedMarkdown(""); // reset before starting

    // add one character every `delay` ms
    const interval = setInterval(() => {
      if (currentIndex < markdown.length) {
        setTypedMarkdown((prev) => prev + markdown[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval); // done typing, clear interval
      }
    }, delay);

    return () => clearInterval(interval); // cleanup if markdown or delay changes/unmount
  }, [markdown, delay]); // re-run if markdown or delay changes

  return typedMarkdown; // return current typed value
};
