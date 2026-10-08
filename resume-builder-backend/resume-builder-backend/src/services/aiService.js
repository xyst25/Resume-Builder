const ApiError = require("../utils/ApiError");

const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Hard rule enforced in every prompt: the model improves wording only,
// it never adds jobs, skills, dates or employers the user didn't provide.
const NO_FABRICATION_RULE = `
You are a resume writing assistant. You may ONLY rephrase, reorganize,
condense or polish the information the user actually gives you.
You must NEVER invent or add: jobs, employers, job titles, degrees,
institutions, certifications, skills, tools, metrics, dates, or years
of experience that were not present in the user's input.
If the input is too thin to improve meaningfully, make only small
wording/grammar improvements rather than padding it with invented detail.
Return plain text only, no markdown, no quotation marks around the output.
`.trim();

async function callChatCompletion({ system, user, temperature = 0.4, jsonMode = false }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new ApiError(500, "AI service is not configured (missing OPENAI_API_KEY)");
  }

  const body = {
    model: MODEL,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error("[aiService] upstream error:", response.status, errText);
    throw new ApiError(502, "The AI service failed to respond. Please try again.");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new ApiError(502, "The AI service returned an empty response.");
  }
  return content;
}

async function improveText({ fieldLabel, text, instruction }) {
  const system = NO_FABRICATION_RULE;
  const user = `
Field: ${fieldLabel}
Instruction: ${instruction}

User's current text:
"""
${text}
"""

Rewrite it following the instruction. Output only the rewritten text.
`.trim();

  return callChatCompletion({ system, user });
}

async function suggestSkills({ experienceText, projectsText }) {
  const system = `${NO_FABRICATION_RULE}
You suggest skills to ADD to a "suggested skills" list for the user to review
and confirm themselves — you do not add them to the resume directly. Only
suggest skills that are clearly evidenced by the text provided (e.g. a
specific library, language or tool that is named or unmistakably implied).
Return a JSON object: { "suggestions": string[] }.`;

  const user = `
Experience text:
"""
${experienceText || "(none provided)"}
"""

Projects text:
"""
${projectsText || "(none provided)"}
"""
`.trim();

  const raw = await callChatCompletion({ system, user, jsonMode: true });
  try {
    return JSON.parse(raw);
  } catch {
    return { suggestions: [] };
  }
}

async function analyzeJobMatch({ resumeData, jobDescription }) {
  const system = `
You are an ATS (applicant tracking system) and job-matching analyst.
Compare the candidate's resume data against the job description and
return STRICT JSON with this shape:
{
  "matchScore": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "suggestions": string[]
}
Suggestions must never tell the user to claim a skill or qualification
they don't have — only suggest surfacing things they already have
more prominently, or phrase them with wording like "if you have genuine
experience with X, consider adding it".
`.trim();

  const user = `
Resume data (JSON):
${JSON.stringify(resumeData)}

Job description:
"""
${jobDescription}
"""
`.trim();

  const raw = await callChatCompletion({ system, user, jsonMode: true, temperature: 0.2 });
  try {
    return JSON.parse(raw);
  } catch {
    throw new ApiError(502, "Could not parse AI job match analysis.");
  }
}

async function scoreResume({ resumeData }) {
  const system = `
You are an ATS resume scorer. Score the given resume data and return
STRICT JSON with this shape:
{
  "overallScore": number (0-100),
  "categories": {
    "atsCompatibility": number (0-100),
    "contentQuality": number (0-100),
    "skillsMatch": number (0-100),
    "formatting": number (0-100),
    "keywordOptimization": number (0-100)
  },
  "suggestions": string[]
}
Base this only on the structure and content actually present in resume_data.
`.trim();

  const user = `Resume data (JSON):\n${JSON.stringify(resumeData)}`;

  const raw = await callChatCompletion({ system, user, jsonMode: true, temperature: 0.2 });
  try {
    return JSON.parse(raw);
  } catch {
    throw new ApiError(502, "Could not parse AI resume score.");
  }
}

module.exports = { improveText, suggestSkills, analyzeJobMatch, scoreResume };
