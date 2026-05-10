import Knowledge from "../models/Knowledge.js";
import axios from "axios";

/**
 * Service to handle Retrieval-Augmented Generation (RAG)
 */
class RAGService {
  /**
   * Generates embeddings for a given text.
   * Note: You'll need an Embedding API key (OpenAI/HuggingFace/Cohere)
   * For now, this is a template.
   */
  async generateEmbedding(text) {
    // Replace with your preferred embedding provider
    // Example using OpenAI (requires VITE_OPENAI_API_KEY in .env)
    try {
      // If you don't have an OpenAI key, you can use a free HuggingFace model
      // or a local transformer library.
      console.log("Generating embedding for text...");
      
      // Placeholder: Return a mock vector if no key is found
      // Real implementation would be:
      /*
      const response = await axios.post('https://api.openai.com/v1/embeddings', {
        input: text,
        model: "text-embedding-3-small"
      }, {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      });
      return response.data.data[0].embedding;
      */
      
      return new Array(1536).fill(0); // Mock vector
    } catch (error) {
      console.error("Embedding Error:", error);
      throw error;
    }
  }

  /**
   * Performs a vector search in MongoDB Atlas
   */
  async searchKnowledge(queryText) {
    try {
      const queryVector = await this.generateEmbedding(queryText);

      // Perform Vector Search using MongoDB Aggregate
      const results = await Knowledge.aggregate([
        {
          $vectorSearch: {
            index: "vector_index", // This name must match the Atlas index name
            path: "embedding",
            queryVector: queryVector,
            numCandidates: 100,
            limit: 5,
          },
        },
        {
          $project: {
            content: 1,
            score: { $meta: "vectorSearchScore" },
            metadata: 1
          }
        }
      ]);

      return results.map(r => r.content).join("\n\n");
    } catch (error) {
      console.error("Vector Search Error:", error);
      return ""; // Fallback to no context
    }
  }

  /**
   * Ingests a new piece of information into the knowledge base
   */
  async ingestKnowledge(content, source, category) {
    const embedding = await this.generateEmbedding(content);
    await Knowledge.create({
      content,
      metadata: { source, category },
      embedding
    });
  }
}

export default new RAGService();
