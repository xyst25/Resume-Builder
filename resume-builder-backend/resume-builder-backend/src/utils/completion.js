// Derives a rough completion percentage + checklist from resume_data.
// Kept intentionally simple and transparent (no magic/AI) since the
// frontend displays this as a literal checklist.
function calculateCompletion(resumeData = {}) {
  const checks = {
    personalInfo: Boolean(
      resumeData?.personalInfo?.fullName && resumeData?.personalInfo?.email
    ),
    summary: Boolean(resumeData?.summary && resumeData.summary.trim().length > 20),
    education: Array.isArray(resumeData?.education) && resumeData.education.length > 0,
    experience: Array.isArray(resumeData?.experience) && resumeData.experience.length > 0,
    projects: Array.isArray(resumeData?.projects) && resumeData.projects.length > 0,
    skills: Boolean(
      resumeData?.skills &&
        (resumeData.skills.technical?.length ||
          resumeData.skills.soft?.length ||
          resumeData.skills.tools?.length)
    ),
    certifications:
      Array.isArray(resumeData?.certifications) && resumeData.certifications.length > 0,
  };

  const total = Object.keys(checks).length;
  const completed = Object.values(checks).filter(Boolean).length;
  const percentage = Math.round((completed / total) * 100);

  return { percentage, checklist: checks };
}

module.exports = { calculateCompletion };
