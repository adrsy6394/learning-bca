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
    <div className="p-6 pt-28 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          📊 Your Learning Progress
        </h2>

        {!bcaSyllabus ? (
          <div className="text-center text-indigo-500 animate-pulse py-20">Loading syllabus data...</div>
        ) : (
          Object.entries(bcaSyllabus).map(([semesterKey, subjects]) => (
          <div key={semesterKey} className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-slate-700 dark:text-slate-300 flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-1 rounded-lg mr-3 text-sm">Sem</span>
              {semesterKey.replace("semester", "Semester ")}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(subjects).map(([subjectKey, subjectData]) => {
                const { totalTopics, learnedTopics, percentage } = getSubjectProgress(
                  semesterKey.replace("semester", ""),
                  subjectData
                );

                return (
                  <div key={subjectKey} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{subjectData.name}</h4>
                      <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">{percentage}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                      <span>{learnedTopics} Topics Learned</span>
                      <span>Total: {totalTopics}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default ProgressPage;
