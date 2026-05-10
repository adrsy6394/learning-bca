import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { FlashcardMode } from "../components/features/FlashcardMode";

const FlashcardsPage = () => {
  const { user } = useContext(AuthContext);
  const [semester, setSemester] = useState("1");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [subjectList, setSubjectList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [bcaSyllabus, setBcaSyllabus] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_MAIN_URL}/api/v2/syllabus`);
        const data = await response.json();
        setBcaSyllabus(data);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };
    fetchSyllabus();
  }, []);

  // Update subject list when semester changes, and reset downstream selections
  useEffect(() => {
    if (!bcaSyllabus) return;
    const subjects = bcaSyllabus[`semester${semester}`];
    setSubjectList(subjects ? Object.values(subjects).map((s) => s.name) : []); // extract subject names
    setSubject(""); // clear selected subject
    setUnit(""); // clear selected unit
    setUnitList([]); // reset unit list
    setCards([]); // clear existing cards
  }, [semester, bcaSyllabus]);

  // Update unit list when subject changes, and reset related state
  useEffect(() => {
    if (!bcaSyllabus) return;
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
  }, [subject, bcaSyllabus]);

  // Generate flashcard objects based on current semester, subject, and unit
  const generateCards = () => {
    if (!semester || !subject || !unit || !bcaSyllabus) return; // guard: need all selections
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

      // Get user progress to mark already learned cards
      const semKeyShort = semester.toString();
      const userProgress = user?.progress?.[semKeyShort]?.[subject]?.[unit] || [];

      // Build new card array from topics, answer will be fetched later
      const newCards = selectedUnit.topics.map((t) => ({
        topic: t.topic,
        answer: null, // Will be generated dynamically
        learned: userProgress.includes(t.topic.trim()), // check against user progress (trimmed)
      }));

      setCards(newCards); // update cards
      setLoading(false); // done loading
    }, 700);
  };

  return (
    <div className="pt-28 p-6 space-y-6 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300">
      <div className="flex justify-center">
        <div className="py-12 space-y-8 text-center bg-white dark:bg-slate-800/50 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 px-8 w-[95%] md:w-[70%] lg:w-[60%] mx-auto transition-all duration-500">
          <label className="block font-black text-2xl text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎓 Select Semester & Subject
          </label>

          <div className="flex flex-col space-y-4">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium"
            >
              {bcaSyllabus && Object.keys(bcaSyllabus).length > 0 ? (
                Object.keys(bcaSyllabus)
                  .map(key => key.replace("semester", ""))
                  .sort((a, b) => a - b)
                  .map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))
              ) : (
                [1, 2, 3, 4, 5, 6].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))
              )}
            </select>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50"
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
          <p className="text-gray-500 dark:text-gray-400 py-32 text-xl">
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
