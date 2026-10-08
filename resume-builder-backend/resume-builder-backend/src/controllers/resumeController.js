const { query } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { calculateCompletion } = require("../utils/completion");

// Shared helper: fetch a resume AND verify it belongs to req.user.
// Throws 404 (not 403) if it exists but belongs to someone else, so we
// don't leak which resume IDs exist to other users.
async function getOwnedResumeOrThrow(resumeId, userId) {
  const { rows } = await query("SELECT * FROM resumes WHERE id = $1", [resumeId]);
  if (rows.length === 0 || rows[0].user_id !== userId) {
    throw new ApiError(404, "Resume not found");
  }
  return rows[0];
}

function serialize(row) {
  return {
    id: row.id,
    title: row.title,
    template: row.template,
    resumeData: row.resume_data,
    completion: row.completion_pct,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/resumes
const listResumes = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC`,
    [req.user.id]
  );
  res.json({ success: true, resumes: rows.map(serialize) });
});

// POST /api/resumes
const createResume = asyncHandler(async (req, res) => {
  const { title, template, resumeData } = req.body;
  const data = resumeData || {};
  const { percentage } = calculateCompletion(data);

  const { rows } = await query(
    `INSERT INTO resumes (user_id, title, template, resume_data, completion_pct)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      req.user.id,
      title?.trim() || "Untitled Resume",
      template || "modern",
      JSON.stringify(data),
      percentage,
    ]
  );

  res.status(201).json({ success: true, resume: serialize(rows[0]) });
});

// GET /api/resumes/:id
const getResume = asyncHandler(async (req, res) => {
  const resume = await getOwnedResumeOrThrow(req.params.id, req.user.id);
  res.json({ success: true, resume: serialize(resume) });
});

// PUT /api/resumes/:id
// Also writes a new row into resume_versions, so edits are recoverable.
const updateResume = asyncHandler(async (req, res) => {
  const existing = await getOwnedResumeOrThrow(req.params.id, req.user.id);
  const { title, template, resumeData } = req.body;

  const nextData = resumeData ?? existing.resume_data;
  const { percentage } = calculateCompletion(nextData);

  const { rows } = await query(
    `UPDATE resumes
     SET title = $1, template = $2, resume_data = $3, completion_pct = $4
     WHERE id = $5
     RETURNING *`,
    [
      title?.trim() || existing.title,
      template || existing.template,
      JSON.stringify(nextData),
      percentage,
      existing.id,
    ]
  );

  // Best-effort version snapshot; don't fail the save if this hiccups.
  try {
    const { rows: versionRows } = await query(
      `SELECT COALESCE(MAX(version_number), 0) + 1 AS next_version
       FROM resume_versions WHERE resume_id = $1`,
      [existing.id]
    );
    await query(
      `INSERT INTO resume_versions (resume_id, version_number, resume_data)
       VALUES ($1, $2, $3)`,
      [existing.id, versionRows[0].next_version, JSON.stringify(nextData)]
    );
  } catch (err) {
    console.error("[resume versions] failed to snapshot version:", err.message);
  }

  res.json({ success: true, resume: serialize(rows[0]) });
});

// DELETE /api/resumes/:id
const deleteResume = asyncHandler(async (req, res) => {
  const existing = await getOwnedResumeOrThrow(req.params.id, req.user.id);
  await query("DELETE FROM resumes WHERE id = $1", [existing.id]);
  res.json({ success: true, message: "Resume deleted" });
});

// POST /api/resumes/:id/duplicate
const duplicateResume = asyncHandler(async (req, res) => {
  const existing = await getOwnedResumeOrThrow(req.params.id, req.user.id);
  const { rows } = await query(
    `INSERT INTO resumes (user_id, title, template, resume_data, completion_pct)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      req.user.id,
      `${existing.title} (Copy)`,
      existing.template,
      existing.resume_data,
      existing.completion_pct,
    ]
  );
  res.status(201).json({ success: true, resume: serialize(rows[0]) });
});

// GET /api/resumes/:id/versions
const listVersions = asyncHandler(async (req, res) => {
  const existing = await getOwnedResumeOrThrow(req.params.id, req.user.id);
  const { rows } = await query(
    `SELECT id, version_number, created_at FROM resume_versions
     WHERE resume_id = $1 ORDER BY version_number DESC`,
    [existing.id]
  );
  res.json({ success: true, versions: rows });
});

// POST /api/resumes/:id/versions/:versionId/restore
const restoreVersion = asyncHandler(async (req, res) => {
  const existing = await getOwnedResumeOrThrow(req.params.id, req.user.id);
  const { rows } = await query(
    `SELECT * FROM resume_versions WHERE id = $1 AND resume_id = $2`,
    [req.params.versionId, existing.id]
  );
  if (rows.length === 0) throw new ApiError(404, "Version not found");

  const { percentage } = calculateCompletion(rows[0].resume_data);
  const { rows: updated } = await query(
    `UPDATE resumes SET resume_data = $1, completion_pct = $2 WHERE id = $3 RETURNING *`,
    [JSON.stringify(rows[0].resume_data), percentage, existing.id]
  );

  res.json({ success: true, resume: serialize(updated[0]) });
});

module.exports = {
  listResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
  duplicateResume,
  listVersions,
  restoreVersion,
};
