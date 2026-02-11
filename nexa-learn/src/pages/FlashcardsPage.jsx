import React, { useState, useEffect } from "react";
import bcaSyllabus from "../data/bcaSyllabus";
import { FlashcardMode } from "../components/features/FlashcardMode";

const FlashcardsPage = () => {
  const [semester, setSemester] = useState("1");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [subjectList, setSubjectList] = useState([]);
  const [unitList, setUnitList] = useState([]);

  // Update subject list when semester changes, and reset downstream selections
  useEffect(() => {
    const subjects = bcaSyllabus[`semester${semester}`];
    setSubjectList(subjects ? Object.values(subjects).map((s) => s.name) : []); // extract subject names
    setSubject(""); // clear selected subject
    setUnit(""); // clear selected unit
    setUnitList([]); // reset unit list
    setCards([]); // clear existing cards
  }, [semester]);

  // Update unit list when subject changes, and reset related state
  useEffect(() => {
    const selectedSemester = bcaSyllabus[`semester${semester}`];
    if (selectedSemester) {
      // find the key whose name matches selected subject
      const subjectKey = Object.keys(selectedSemester).find(
        (key) => selectedSemester[key].name === subject
      );
      const units = subjectKey ? selectedSemester[subjectKey].units : [];
      setUnitList(units.map((u) => u.name)); // set available unit names
      setUnit(""); // clear selected unit
      setCards([]); // clear cards because unit changed
    }
  }, [subject]);

  // Generate flashcard objects based on current semester, subject, and unit
  const generateCards = () => {
    if (!semester || !subject || !unit) return; // guard: need all selections
    setLoading(true); // show loading state

    // simulate async delay (could be replaced with real async logic)
    setTimeout(() => {
      const semKey = `semester${semester}`;
      const selectedSemester = bcaSyllabus[semKey];
      const subjectKey = Object.keys(selectedSemester).find(
        (key) => selectedSemester[key].name === subject
      );
      const subjData = selectedSemester[subjectKey];
      const selectedUnit = subjData.units.find((u) => u.name === unit);

      if (!selectedUnit) {
        setCards([]); // nothing found, clear cards
        setLoading(false);
        return;
      }

      // Build new card array from topics, defaulting answer if missing
      const newCards = selectedUnit.topics.map((t) => ({
        topic: t.topic,
        answer: t.answer || "No answer available.",
        learned: false, // initial state
      }));

      setCards(newCards); // update cards
      setLoading(false); // done loading
    }, 700);
  };

  return (
    <div className="my-36 p-6 space-y-6 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300">
      <div className="flex justify-center">
        <div className="py-4 space-y-6 text-center dark:bg-gray-800 rounded-lg shadow-xl border-2 px-6 w-96">
          <label className="block font-semibold text-lg text-center border-b-4 dark:border-gray-500 rounded-lg">
            🎓 Select Semester & Subject:
          </label>

          <div className="flex flex-col space-y-4">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 cursor-cell"
            >
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 cursor-cell"
            >
              <option value="">-- Choose Subject --</option>
              {subjectList.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800 cursor-cell"
            >
              <option value="">Select Unit</option>
              {unitList.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <button
              onClick={generateCards}
              disabled={!subject || loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition cursor-pointer w-52 self-center"
            >
              {loading ? "⏳ Generating..." : "Generate Flashcards"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {cards.length > 0 && !loading && (
          <div className="font-medium border-b-4 w-fit mt-4">
            ✅ Total Flashcards: {cards.length}
          </div>
        )}
        {!cards.length && !loading && (
          <p className="text-gray-500 dark:text-gray-400 py-40 text-xl">
            🔍 No flashcards to show. Please select a semester & subject to
            click Generate.
          </p>
        )}
        {loading && (
          <div className="text-indigo-500 animate-pulse">⏳ Please wait...</div>
        )}
      </div>

      {cards.length > 0 && !loading && (
        <FlashcardMode
          cards={cards}
          setCards={setCards}
          semester={semester}
          subject={subject}
          unit={unit}
        />
      )}

      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-20 w-full shadow-inner">
        <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">Team</a>
              </li>
              <li>
                <a href="#">Mission</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">Docs</a>
              </li>
              <li>
                <a href="#">GitHub</a>
              </li>
              <li>
                <a href="#">API</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs py-4 border-t border-gray-300 dark:border-gray-700">
          © 2025 NexaLearn. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default FlashcardsPage;
