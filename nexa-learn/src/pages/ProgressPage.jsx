import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProgressPage = () => {
  const { user } = useContext(AuthContext);
  const progress = user?.progress || {};
  const [bcaSyllabus, setBcaSyllabus] = React.useState(null);

  React.useEffect(() => {
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

  // Normalize string for comparison: collapse whitespace, trim, and lowercase
  const normalize = (str) => str?.replace(/\s+/g, " ")?.trim()?.toLowerCase();

  // Compute progress for a given subject in a semester
  const getSubjectProgress = (semesterKey, subjectData) => {
    const units = subjectData.units || [];
    let totalTopics = 0;
    let learnedTopics = 0;

    const normalizedSubjectName = normalize(subjectData.name);
    const semesterProgress = progress?.[semesterKey] || {};

    const subjectKey = Object.keys(semesterProgress).find(
      (key) => normalize(key) === normalizedSubjectName
    );

    units.forEach((unit) => {
      const unitName = unit.name;
      const topics = unit.topics || [];
      totalTopics += topics.length;

      const subjectProgress = semesterProgress?.[subjectKey] || {};
      const actualUnitKey = Object.keys(subjectProgress).find(
        (key) => normalize(key) === normalize(unitName)
      );
      const unitProgress = subjectProgress[actualUnitKey] || [];
      learnedTopics += unitProgress.length;
    });

    const percentage = totalTopics > 0 ? Math.round((learnedTopics / totalTopics) * 100) : 0;
    return { totalTopics, learnedTopics, percentage };
  };

  return (
    <div className="pt-28 min-h-screen bg-[#fdf7e9] transition-all duration-300">
      
      {/* Header Section */}
      <div className="bg-[#0b2b24] py-20 px-6 text-center relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        
        <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tighter mb-4">
          YOUR <span className="text-[#d1e8c4]">PROGRESS</span>
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light tracking-wide uppercase text-xs tracking-[0.3em]">
          Tracking your journey towards BCA excellence
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {!bcaSyllabus ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#d1e8c4] border-t-[#0b2b24] rounded-full animate-spin"></div>
            <p className="text-[#0b2b24] font-black text-xs uppercase tracking-widest animate-pulse">Calculating stats...</p>
          </div>
        ) : (
          Object.entries(bcaSyllabus).map(([semesterKey, subjects]) => (
          <div key={semesterKey} className="mb-20">
            <div className="flex items-center mb-10">
              <h3 className="text-2xl font-serif text-[#0b2b24] uppercase tracking-[0.2em] border-b-2 border-[#d1e8c4] pb-2">
                {semesterKey.replace("semester", "Semester ")}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(subjects).map(([subjectKey, subjectData]) => {
                const { totalTopics, learnedTopics, percentage } = getSubjectProgress(
                  semesterKey.replace("semester", ""),
                  subjectData
                );

                return (
                  <div key={subjectKey} className="bg-white p-8 rounded-[2rem] shadow-xl border border-[#0b2b24]/5 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-lg font-bold text-[#0b2b24] max-w-[70%]">{subjectData.name}</h4>
                      <div className="w-14 h-14 rounded-full bg-[#fdf7e9] border border-[#d1e8c4] flex items-center justify-center">
                        <span className="text-sm font-black text-[#0b2b24]">{percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-[#fdf7e9] rounded-full h-3 mb-6 overflow-hidden border border-[#0b2b24]/5">
                      <div
                        className="bg-[#d1e8c4] h-full rounded-full transition-all duration-1000 ease-out border-r-2 border-[#0b2b24]/20"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0b2b24]/40">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-[#d1e8c4]"></div>
                        <span>{learnedTopics} Topics Learned</span>
                      </div>
                      <span>Total: {totalTopics}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )))}
      </div>

      {/* FOOTER */}
      <footer className="py-20 bg-[#0b2b24] text-white/40 text-center">
         <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10">
            <p className="text-xs font-black uppercase tracking-[0.3em]">© 2025 E-STUDY Platform • Premium Education</p>
         </div>
      </footer>
    </div>
  );
};

export default ProgressPage;
