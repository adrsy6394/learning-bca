import Syllabus from '../models/Syllabus.js';

// Fetch the complete syllabus and format it for the frontend
export const getSyllabus = async (req, res) => {
  try {
    let syllabus = await Syllabus.find().sort({ semester: 1 });
    
    // Sort subjects by extracting the numeric code (e.g., 101, 102)
    syllabus = syllabus.sort((a, b) => {
      if (a.semester !== b.semester) return a.semester - b.semester;
      
      const numA = a.subjectName.match(/\d{3}/);
      const numB = b.subjectName.match(/\d{3}/);
      
      const valA = numA ? parseInt(numA[0], 10) : 0;
      const valB = numB ? parseInt(numB[0], 10) : 0;
      
      return valA - valB;
    });
    
    const structuredSyllabus = {};
    
    syllabus.forEach((doc) => {
      const semKey = `semester${doc.semester}`;
      if (!structuredSyllabus[semKey]) {
        structuredSyllabus[semKey] = {};
      }
      
      const subjKey = `subject${Object.keys(structuredSyllabus[semKey]).length + 1}`;
      
      structuredSyllabus[semKey][subjKey] = {
        name: doc.subjectName,
        units: doc.units.map(u => ({
          name: u.unitName,
          topics: u.topics.map(t => ({ topic: t })) 
        }))
      };
    });

    res.status(200).json(structuredSyllabus);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
