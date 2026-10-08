import { Plus, Trash2, Sparkles } from "lucide-react";

function ResumeEditor({
  resume,
  updateResume,
  setResume,
}) {

  const updatePersonal = (field, value) => {
    updateResume("personal", field, value);
  };


  const updateEducation = (index, field, value) => {

    const updated = [...resume.education];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setResume({
      ...resume,
      education: updated,
    });
  };


  const addEducation = () => {

    setResume({
      ...resume,

      education: [
        ...resume.education,

        {
          institution: "",
          degree: "",
          start: "",
          end: "",
          grade: "",
        },
      ],
    });
  };


  const deleteEducation = (index) => {

    setResume({
      ...resume,
      education: resume.education.filter(
        (_, i) => i !== index
      ),
    });
  };


  const updateExperience = (index, field, value) => {

    const updated = [...resume.experience];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setResume({
      ...resume,
      experience: updated,
    });
  };


  const addExperience = () => {

    setResume({
      ...resume,

      experience: [
        ...resume.experience,

        {
          company: "",
          position: "",
          start: "",
          end: "",
          description: "",
        },
      ],
    });
  };


  const deleteExperience = (index) => {

    setResume({
      ...resume,

      experience: resume.experience.filter(
        (_, i) => i !== index
      ),
    });
  };


  const updateProject = (index, field, value) => {

    const updated = [...resume.projects];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setResume({
      ...resume,
      projects: updated,
    });
  };


  const addProject = () => {

    setResume({
      ...resume,

      projects: [
        ...resume.projects,

        {
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    });
  };


  const deleteProject = (index) => {

    setResume({
      ...resume,

      projects: resume.projects.filter(
        (_, i) => i !== index
      ),
    });
  };


  return (
    <div className="editor">

      <div className="editor-title">
        <div>
          <h1>Build your resume</h1>
          <p>Fill in your information below.</p>
        </div>

        <div className="ai-status">
          <Sparkles size={15} />
          AI Ready
        </div>
      </div>


      {/* PERSONAL */}

      <div className="editor-card">

        <h2>Personal Information</h2>

        <div className="form-grid">

          <input
            placeholder="Full Name"
            value={resume.personal.name}
            onChange={(e) =>
              updatePersonal("name", e.target.value)
            }
          />

          <input
            placeholder="Job Title"
            value={resume.personal.title}
            onChange={(e) =>
              updatePersonal("title", e.target.value)
            }
          />

          <input
            placeholder="Email"
            value={resume.personal.email}
            onChange={(e) =>
              updatePersonal("email", e.target.value)
            }
          />

          <input
            placeholder="Phone"
            value={resume.personal.phone}
            onChange={(e) =>
              updatePersonal("phone", e.target.value)
            }
          />

          <input
            placeholder="Location"
            value={resume.personal.location}
            onChange={(e) =>
              updatePersonal("location", e.target.value)
            }
          />

          <input
            placeholder="LinkedIn"
            value={resume.personal.linkedin}
            onChange={(e) =>
              updatePersonal("linkedin", e.target.value)
            }
          />

          <input
            placeholder="GitHub"
            value={resume.personal.github}
            onChange={(e) =>
              updatePersonal("github", e.target.value)
            }
          />

        </div>

      </div>


      {/* SUMMARY */}

      <div className="editor-card">

        <div className="section-title-row">

          <h2>Professional Summary</h2>

          <button className="ai-button">
            <Sparkles size={15} />
            Improve with AI
          </button>

        </div>

        <textarea
          rows="5"
          value={resume.summary}
          onChange={(e) =>
            setResume({
              ...resume,
              summary: e.target.value,
            })
          }
        />

      </div>


      {/* EDUCATION */}

      <div className="editor-card">

        <div className="section-title-row">

          <h2>Education</h2>

          <button
            className="add-button"
            onClick={addEducation}
          >
            <Plus size={16} />
            Add
          </button>

        </div>


        {resume.education.map((education, index) => (

          <div
            className="repeatable-section"
            key={index}
          >

            <div className="repeatable-header">

              <strong>
                Education {index + 1}
              </strong>

              {resume.education.length > 1 && (
                <button
                  className="delete-button"
                  onClick={() =>
                    deleteEducation(index)
                  }
                >
                  <Trash2 size={16} />
                </button>
              )}

            </div>


            <div className="form-grid">

              <input
                placeholder="Institution"
                value={education.institution}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "institution",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Degree"
                value={education.degree}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "degree",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Start Year"
                value={education.start}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "start",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="End Year"
                value={education.end}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "end",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="CGPA / Grade"
                value={education.grade}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "grade",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        ))}

      </div>


      {/* EXPERIENCE */}

      <div className="editor-card">

        <div className="section-title-row">

          <h2>Experience</h2>

          <button
            className="add-button"
            onClick={addExperience}
          >
            <Plus size={16} />
            Add
          </button>

        </div>


        {resume.experience.map((experience, index) => (

          <div
            className="repeatable-section"
            key={index}
          >

            <div className="repeatable-header">

              <strong>
                Experience {index + 1}
              </strong>

              {resume.experience.length > 1 && (
                <button
                  className="delete-button"
                  onClick={() =>
                    deleteExperience(index)
                  }
                >
                  <Trash2 size={16} />
                </button>
              )}

            </div>


            <div className="form-grid">

              <input
                placeholder="Company"
                value={experience.company}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "company",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Position"
                value={experience.position}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "position",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Start Year"
                value={experience.start}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "start",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="End Year"
                value={experience.end}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "end",
                    e.target.value
                  )
                }
              />

            </div>


            <textarea
              rows="4"
              placeholder="Describe your responsibilities and achievements..."
              value={experience.description}
              onChange={(e) =>
                updateExperience(
                  index,
                  "description",
                  e.target.value
                )
              }
            />

            <button className="ai-button">
              <Sparkles size={15} />
              Improve with AI
            </button>

          </div>

        ))}

      </div>


      {/* PROJECTS */}

      <div className="editor-card">

        <div className="section-title-row">

          <h2>Projects</h2>

          <button
            className="add-button"
            onClick={addProject}
          >
            <Plus size={16} />
            Add
          </button>

        </div>


        {resume.projects.map((project, index) => (

          <div
            className="repeatable-section"
            key={index}
          >

            <div className="repeatable-header">

              <strong>
                Project {index + 1}
              </strong>

              {resume.projects.length > 1 && (
                <button
                  className="delete-button"
                  onClick={() =>
                    deleteProject(index)
                  }
                >
                  <Trash2 size={16} />
                </button>
              )}

            </div>


            <input
              placeholder="Project Name"
              value={project.name}
              onChange={(e) =>
                updateProject(
                  index,
                  "name",
                  e.target.value
                )
              }
            />

            <textarea
              rows="4"
              placeholder="Project Description"
              value={project.description}
              onChange={(e) =>
                updateProject(
                  index,
                  "description",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Technologies"
              value={project.technologies}
              onChange={(e) =>
                updateProject(
                  index,
                  "technologies",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Project / GitHub Link"
              value={project.link}
              onChange={(e) =>
                updateProject(
                  index,
                  "link",
                  e.target.value
                )
              }
            />

          </div>

        ))}

      </div>


      {/* SKILLS */}

      <div className="editor-card">

        <h2>Skills</h2>

        <input
          placeholder="JavaScript, React, Python, Git..."
          value={resume.skills.join(", ")}
          onChange={(e) =>
            setResume({
              ...resume,
              skills: e.target.value
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
            })
          }
        />

      </div>

    </div>
  );
}

export default ResumeEditor;