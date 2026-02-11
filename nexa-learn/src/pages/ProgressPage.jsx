import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import bcaSyllabus from "../data/bcaSyllabus";

const ProgressPage = () => {
  const { user } = useContext(AuthContext);
  const progress = user?.progress || {};

  // Normalize string for comparison: collapse whitespace, trim, and lowercase
  const normalize = (str) => str?.replace(/\s+/g, " ")?.trim()?.toLowerCase();

  // Compute progress for a given subject in a semester
  const getSubjectProgress = (semesterKey, subjectData) => {
    const units = subjectData.units || []; // list of units under the subject

    let totalTopics = 0; // total number of topics in this subject
    let learnedTopics = 0; // how many have been marked learned

    const normalizedSubjectName = normalize(subjectData.name); // normalized display name
    const semesterProgress = progress?.[semesterKey] || {}; // user progress for the semester

    // Find the key in stored progress that matches the subject name (case/space insensitive)
    const subjectKey = Object.keys(semesterProgress).find(
      (key) => normalize(key) === normalizedSubjectName
    );

    // Iterate units to accumulate topic counts
    units.forEach((unit) => {
      const unitName = unit.name;
      const topics = unit.topics || [];

      totalTopics += topics.length; // increment total topics

      // Get learned topics for this unit (safely fallback if path missing)
      const unitProgress = semesterProgress?.[subjectKey]?.[unitName] || [];

      learnedTopics += unitProgress.length; // increment learned count
    });

    // Calculate percentage learned (rounded)
    const percentage =
      totalTopics > 0 ? Math.round((learnedTopics / totalTopics) * 100) : 0;

    return { totalTopics, learnedTopics, percentage };
  };

  return (
    <div className="p-6 pt-28 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-8 text-center">
        📊 Your Flashcard Progress
      </h2>

      {Object.entries(bcaSyllabus).map(([semesterKey, subjects]) => (
        <div key={semesterKey} className="mb-12">
          <h3 className="text-xl font-semibold mb-4 border-b pb-1">
            🎓 {semesterKey.replace("semester", "Semester ")}
          </h3>

          {Object.entries(subjects).map(([subjectKey, subjectData]) => {
            const { totalTopics, learnedTopics, percentage } =
              getSubjectProgress(
                semesterKey.replace("semester", ""),
                subjectData
              );

            return (
              <div
                key={subjectKey}
                className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow"
              >
                <h4 className="text-lg font-semibold mb-2">
                  {subjectData.name}
                </h4>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✅ {learnedTopics} of {totalTopics} topics learned (
                  {percentage}%)
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ProgressPage;
