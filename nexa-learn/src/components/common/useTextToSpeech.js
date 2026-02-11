import { useState } from "react";

// Custom hook for text-to-speech functionality
export const useTextToSpeech = () => {
  const [speaking, setSpeaking] = useState(false); // track if currently speaking
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window; // check browser support
  const synth = supported ? window.speechSynthesis : null; // reference to speechSynthesis

  // Speak given text
  const speak = (text) => {
    if (!supported || !text) return; // do nothing if unsupported or no text

    synth.cancel(); // stop any existing speech

    const utterance = new SpeechSynthesisUtterance(text); // create new utterance
    utterance.onstart = () => setSpeaking(true); // mark speaking start
    utterance.onend = () => setSpeaking(false); // mark speaking end

    synth.speak(utterance); // start speaking
  };

  // Stop any ongoing speech
  const stop = () => {
    if (supported) {
      synth.cancel(); // cancel speech
      setSpeaking(false); // reset speaking state
    }
  };

  return { speak, stop, speaking, supported }; // expose API
};
