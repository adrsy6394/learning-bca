import ragService from "../services/ragService.js";

export const processSyllabusForRag = async (req, res) => {
  try {
    const result = await ragService.processSyllabuses();
    res.status(200).json({
      success: true,
      message: "Syllabus processing completed",
      data: result
    });
  } catch (error) {
    console.error("RAG Processing Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const searchVectorContext = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: "Query is required" });

    const results = await ragService.searchContext(query);
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRagStatus = async (req, res) => {
  try {
    const count = await ragService.getEmbeddedCount();
    res.status(200).json({
      success: true,
      totalEmbedded: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
