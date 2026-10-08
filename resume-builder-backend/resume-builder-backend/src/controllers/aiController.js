const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const aiService = require("../services/aiService");

// POST /api/ai/improve-summary
const improveSummary = asyncHandler(async (req, res) => {
  const { text, mode } = req.body; // mode: "improve" | "grammar" | "ats" | "professional" | "generate"
  if (!text && mode !== "generate") {
    throw new ApiError(400, "text is required");
  }

  const instructions = {
    improve: "Improve clarity, impact and flow while keeping all facts unchanged.",
    grammar: "Fix grammar and spelling only, preserving the original meaning and facts.",
    ats: "Rewrite to be ATS-friendly: clear, keyword-natural, no graphics-dependent phrasing.",
    professional: "Make the tone more professional and concise, keeping all facts unchanged.",
    generate:
      "Write a concise 2-3 sentence professional summary using only the details given.",
  };

  const result = await aiService.improveText({
    fieldLabel: "Professional Summary",
    text: text || req.body.context || "",
    instruction: instructions[mode] || instructions.improve,
  });

  res.json({ success: true, result });
});

// POST /api/ai/improve-experience
const improveExperience = asyncHandler(async (req, res) => {
  const { text, mode } = req.body;
  if (!text) throw new ApiError(400, "text is required");

  const instructions = {
    improve: "Rewrite as 2-4 punchy resume bullet points, preserving every fact.",
    grammar: "Fix grammar and spelling only.",
    ats: "Rewrite as ATS-friendly bullet points using strong action verbs.",
    professional: "Make the tone more professional and results-oriented.",
  };

  const result = await aiService.improveText({
    fieldLabel: "Experience Description",
    text,
    instruction: instructions[mode] || instructions.improve,
  });

  res.json({ success: true, result });
});

// POST /api/ai/improve-project
const improveProject = asyncHandler(async (req, res) => {
  const { text, mode } = req.body;
  if (!text) throw new ApiError(400, "text is required");

  const instructions = {
    improve: "Rewrite as a clear, impactful 1-3 sentence project description.",
    grammar: "Fix grammar and spelling only.",
    ats: "Rewrite to be ATS-friendly, naming technologies clearly.",
    professional: "Make the tone more professional and specific.",
  };

  const result = await aiService.improveText({
    fieldLabel: "Project Description",
    text,
    instruction: instructions[mode] || instructions.improve,
  });

  res.json({ success: true, result });
});

// POST /api/ai/suggest-skills
const suggestSkills = asyncHandler(async (req, res) => {
  const { experienceText, projectsText } = req.body;
  const result = await aiService.suggestSkills({ experienceText, projectsText });
  res.json({ success: true, ...result });
});

// POST /api/ai/analyze-job
const analyzeJob = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;
  if (!resumeData || !jobDescription) {
    throw new ApiError(400, "resumeData and jobDescription are required");
  }
  const result = await aiService.analyzeJobMatch({ resumeData, jobDescription });
  res.json({ success: true, ...result });
});

// POST /api/ai/score-resume
const scoreResume = asyncHandler(async (req, res) => {
  const { resumeData } = req.body;
  if (!resumeData) throw new ApiError(400, "resumeData is required");
  const result = await aiService.scoreResume({ resumeData });
  res.json({ success: true, ...result });
});

module.exports = {
  improveSummary,
  improveExperience,
  improveProject,
  suggestSkills,
  analyzeJob,
  scoreResume,
};
