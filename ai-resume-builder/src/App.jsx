import { useState } from "react";
import LandingPage from "./components/src/components/LandingPage";
import ResumeEditor from "./components/src/components/ResumeEditor";
import ResumePreview from "./components/src/components/ResumePreview";
import TemplateSelector from "./components/src/components/TemplateSelector";

function App() {
  const [page, setPage] = useState("home");

  const [template, setTemplate] = useState("classic");

  const [resume, setResume] = useState({
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
    },

    summary: "",

    education: [
      {
        institution: "",
        degree: "",
        start: "",
        end: "",
        grade: "",
      },
    ],

    experience: [
      {
        company: "",
        position: "",
        start: "",
        end: "",
        description: "",
      },
    ],

    projects: [
      {
        name: "",
        description: "",
        technologies: "",
      },
    ],

    skills: [],
  });

  const updateResume = (section, field, value) => {
    setResume((currentResume) => ({
      ...currentResume,
      [section]: {
        ...currentResume[section],
        [field]: value,
      },
    }));
  };

  if (page === "home") {
    return (
      <LandingPage
        onStart={() => setPage("builder")}
      />
    );
  }

  return (
    <div className="builder-page">

      <header className="builder-header">
        <h2>AI Resume Builder</h2>

        <button
          type="button"
          onClick={() => setPage("home")}
        >
          Back to Home
        </button>
      </header>

      <div className="builder-layout">

        <div className="editor-section">

          <ResumeEditor
            resume={resume}
            updateResume={updateResume}
            setResume={setResume}
          />

          <TemplateSelector
            template={template}
            setTemplate={setTemplate}
          />

        </div>

        <div className="preview-section">

          <ResumePreview
            resume={resume}
            template={template}
          />

        </div>

      </div>

    </div>
  );
}

export default App;