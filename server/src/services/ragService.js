import Knowledge from "../models/Knowledge.js";
// Re-touch for Vercel deployment sync
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
   * Performs a search in Knowledge Base (Vector Search + Text Fallback)
   */
  async searchKnowledge(queryText) {
    try {
      let results = [];

      // 1. Try Vector Search if possible
      try {
        const queryVector = await this.generateEmbedding(queryText);
        // Only attempt vector search if the vector is not just zeros
        if (queryVector.some(v => v !== 0)) {
          results = await Knowledge.aggregate([
            {
              $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryVector,
                numCandidates: 100,
                limit: 5,
              },
            },
          ]);
        }
      } catch (vectorError) {
        console.warn("Vector Search Failed, falling back to text search...");
      }

      // 2. Fallback: Keyword Search (Regex) if no vector results
      if (!results || results.length === 0) {
        const keywords = queryText.split(" ").filter(w => w.length > 2);
        const regexQuery = keywords.map(k => ({ content: { $regex: k, $options: "i" } }));
        
        if (regexQuery.length > 0) {
          results = await Knowledge.find({ $or: regexQuery }).limit(5);
        }
      }

      return results.map(r => r.content).join("\n\n");
    } catch (error) {
      console.error("Search Error:", error);
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
