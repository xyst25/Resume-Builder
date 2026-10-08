const pdfParse = require("pdf-parse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// Very naive section splitter used as a fallback / first pass. Real section
// detection is fuzzy by nature, which is exactly why the frontend must show
// this as an editable draft for the user to confirm, not auto-save it.
function naiveExtract(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const linkedinMatch = text.match(/linkedin\.com\/[^\s,)]+/i);
  const githubMatch = text.match(/github\.com\/[^\s,)]+/i);

  const sectionHeaders = [
    "summary",
    "experience",
    "work experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "achievements",
  ];

  const sections = {};
  let current = "header";
  sections[current] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const matchedHeader = sectionHeaders.find(
      (h) => lower === h || lower.startsWith(h + ":") || lower === h.toUpperCase()
    );
    if (matchedHeader) {
      current = matchedHeader.replace("work experience", "experience");
      sections[current] = sections[current] || [];
      continue;
    }
    sections[current].push(line);
  }

  return {
    personalInfo: {
      fullName: lines[0] || "",
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0] || "",
      linkedin: linkedinMatch?.[0] || "",
      github: githubMatch?.[0] || "",
      location: "",
      title: lines[1] || "",
    },
    summary: (sections.summary || []).join(" "),
    experienceRaw: (sections.experience || []).join("\n"),
    educationRaw: (sections.education || []).join("\n"),
    projectsRaw: (sections.projects || []).join("\n"),
    skillsRaw: (sections.skills || []).join("\n"),
    certificationsRaw: (sections.certifications || []).join("\n"),
  };
}

// POST /api/resumes/import  (multipart/form-data, field name: "file")
const importResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded. Attach a PDF under field 'file'.");
  }
  if (req.file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Only PDF files are supported for import.");
  }

  let parsed;
  try {
    parsed = await pdfParse(req.file.buffer);
  } catch (err) {
    throw new ApiError(422, "Could not read this PDF. It may be scanned/image-based.");
  }

  const draft = naiveExtract(parsed.text || "");

  // Explicitly flagged so the frontend can show a confirmation step rather
  // than silently trusting a heuristic parse.
  res.json({
    success: true,
    requiresConfirmation: true,
    message: "Extraction complete. Please review and correct before saving.",
    draft,
  });
});

module.exports = { importResume };
