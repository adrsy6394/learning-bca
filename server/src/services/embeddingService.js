import { GoogleGenerativeAI } from "@google/generative-ai";

class EmbeddingService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  _init() {
    if (this.model) return;
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in .env. Please check your environment variables.");
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  }

  async generateEmbedding(text) {
    try {
      this._init();
      const result = await this.model.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      });
      return result.embedding.values;
    } catch (error) {
      console.error("Embedding generation error:", error);
      throw error;
    }
  }

  async generateBatchEmbeddings(texts) {
    try {
      this._init();
      const result = await this.model.batchEmbedContents({
        requests: texts.map((t) => ({ 
          content: { role: "user", parts: [{ text: t }] },
          outputDimensionality: 768
        })),
      });
      return result.embeddings.map((e) => e.values);
    } catch (error) {
      console.error("Batch embedding generation error:", error);
      throw error;
    }
  }
}

export default new EmbeddingService();
