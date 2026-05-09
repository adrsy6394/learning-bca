import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Syllabus from '../src/models/Syllabus.js';
import bcaSyllabus from './bcaSyllabus.js';

dotenv.config({ path: '../.env' }); // Assuming script runs from server/scripts

const migrateData = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI;
    if (!MONGODB_URI) {
        throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Syllabus.deleteMany({});
    console.log('Cleared existing syllabus data.');

    const newDocs = [];

    for (const [semKey, semData] of Object.entries(bcaSyllabus)) {
      const semesterNum = parseInt(semKey.replace('semester', ''), 10);
      
      for (const [subjKey, subjData] of Object.entries(semData)) {
        const subjectName = subjData.name;
        
        const units = subjData.units.map(u => {
          return {
            unitName: u.name,
            topics: u.topics.map(t => t.topic.trim()) // keeping only topic string, stripping answer
          };
        });

        newDocs.push({
          semester: semesterNum,
          subjectName: subjectName,
          units: units
        });
      }
    }

    await Syllabus.insertMany(newDocs);
    console.log(`Successfully inserted ${newDocs.length} subjects into the database.`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    mongoose.connection.close();
  }
};

migrateData();
