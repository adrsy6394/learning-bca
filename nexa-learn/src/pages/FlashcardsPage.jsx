import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import Footer from "../components/common/Footer";
import { FileText } from "lucide-react";
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
    <div className="pt-28 min-h-screen bg-[#fdf7e9] transition-all duration-300">
      
      {/* Header Section */}
      <div className="bg-[#0b2b24] py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 border border-white rounded-lg rotate-45"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tighter mb-4">
          SMART <span className="text-[#d1e8c4]">FLASHCARDS</span>
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light tracking-wide">
          Master your BCA subjects with AI-generated quick revision cards.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-[#0b2b24]/5">
          <h2 className="text-2xl font-serif text-[#0b2b24] text-center mb-10 uppercase tracking-widest">
            CONFIGURE YOUR SESSION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-2">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-[#0b2b24]/10 bg-[#fdf7e9]/50 text-[#0b2b24] font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all appearance-none cursor-pointer"
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
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-[#0b2b24]/10 bg-[#fdf7e9]/50 text-[#0b2b24] font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Subject --</option>
                {subjectList.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-2">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-[#0b2b24]/10 bg-[#fdf7e9]/50 text-[#0b2b24] font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Unit --</option>
                {unitList.map((u, idx) => (
                  <option key={idx} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateCards}
              disabled={!subject || loading}
              className="px-12 py-5 bg-[#0b2b24] text-[#d1e8c4] rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? "⏳ Generating..." : "Generate Deck"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {cards.length > 0 && !loading && (
          <div className="mb-10 text-center">
             <span className="px-6 py-2 bg-[#d1e8c4] text-[#0b2b24] rounded-full font-black text-xs uppercase tracking-widest">
              Ready: {cards.length} Flashcards
             </span>
          </div>
        )}
        
        {!cards.length && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#0b2b24]/5 rounded-full flex items-center justify-center mx-auto mb-6">
               <FileText className="text-[#0b2b24]/20" size={40} />
            </div>
            <p className="text-[#0b2b24]/40 font-serif text-2xl uppercase tracking-widest">
              Select subject to start
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#d1e8c4] border-t-[#0b2b24] rounded-full animate-spin"></div>
            <p className="text-[#0b2b24] font-black text-xs uppercase tracking-widest animate-pulse">Building your deck...</p>
          </div>
        )}

        {cards.length > 0 && !loading && (
          <FlashcardMode
            cards={cards}
            setCards={setCards}
            semester={semester}
            subject={subject}
            unit={unit}
          />
        )}
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default FlashcardsPage;
