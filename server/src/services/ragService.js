import Syllabus from "../models/Syllabus.js";
import SyllabusChunk from "../models/SyllabusChunk.js";
import embeddingService from "./embeddingService.js";

class RagService {
  async processSyllabuses() {
    console.log("🚀 Starting Syllabus Processing for RAG...");
    
    const syllabuses = await Syllabus.find({}).sort({ semester: 1 });
    console.log(`Found ${syllabuses.length} syllabuses.`);
    
    let totalChunksCreated = 0;
    let totalChunksSkipped = 0;

    for (const syllabus of syllabuses) {
      // If the document has 'units' array, it's an original syllabus
      if (!syllabus.units || !Array.isArray(syllabus.units)) {
        console.log(`Skipping non-syllabus document: ${syllabus._id}`);
        continue;
      }

      const { semester, subjectName, units } = syllabus;
      console.log(`Processing Semester ${semester}: ${subjectName}`);

      for (const unit of units) {
        const { unitName, topics } = unit;

        for (const topic of topics) {
          // IMPORTANT: Only search for chunks, not original docs
          const existing = await SyllabusChunk.findOne({
            semester,
            subjectName,
            unit: unitName,
            topic,
            embedding: { $exists: true }
          });

          if (existing) {
            totalChunksSkipped++;
            continue;
          }

          const chunkText = `Subject: ${subjectName}, Semester: ${semester}, Unit: ${unitName}, Topic: ${topic}`;
          
          try {
            const embedding = await embeddingService.generateEmbedding(chunkText);

            await SyllabusChunk.create({
              text: chunkText,
              embedding,
              semester,
              subjectName,
              unit: unitName,
              topic
            });

            totalChunksCreated++;
            if (totalChunksCreated % 10 === 0) {
              console.log(`✅ Processed ${totalChunksCreated} chunks...`);
            }
          } catch (error) {
            console.error(`❌ Error processing topic "${topic}":`, error.message);
            if (error.message.includes("Quota")) {
               console.log("Stopping due to quota limit.");
               return { created: totalChunksCreated, skipped: totalChunksSkipped };
            }
          }
        }
      }
    }

    console.log(`✨ Processing Complete! Created: ${totalChunksCreated}, Skipped: ${totalChunksSkipped}`);
    return { created: totalChunksCreated, skipped: totalChunksSkipped };
  }

  async searchContext(query, limit = 5) {
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(query);

      const results = await SyllabusChunk.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: limit
          }
        },
        {
          $project: {
            text: 1,
            semester: 1,
            subjectName: 1,
            unit: 1,
            topic: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ]);

      return results;
    } catch (error) {
      console.error("Vector search error:", error);
      return [];
    }
  }

  async getEmbeddedCount() {
    return await SyllabusChunk.countDocuments({ embedding: { $exists: true } });
  }
}

export default new RagService();
