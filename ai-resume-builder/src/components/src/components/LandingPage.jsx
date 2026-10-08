import {
  Sparkles,
  Eye,
  FileText,
  ArrowRight,
  Check
} from "lucide-react";

function LandingPage({ onStart }) {
  return (
    <div className="landing-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          Resume<span>AI</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>

          <button
            className="nav-button"
            onClick={onStart}
          >
            Create Resume
          </button>
        </div>

      </nav>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            <Sparkles size={15} />
            AI-Powered Resume Builder
          </div>

          <h1>
            Build a Resume
            <br />
            <span>That Gets You Hired.</span>
          </h1>

          <p>
            Create a professional, ATS-friendly resume
            with AI-powered suggestions and a real-time
            preview.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={onStart}
            >
              Create My Resume
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-button"
              onClick={onStart}
            >
              See Example
            </button>

          </div>

          <div className="trust">

            <div>
              <Check size={16} />
              Free to start
            </div>

            <div>
              <Check size={16} />
              ATS-friendly
            </div>

            <div>
              <Check size={16} />
              No design skills needed
            </div>

          </div>

        </div>


        {/* RESUME MOCKUP */}

        <div className="hero-preview">

          <div className="mockup-window">

            <div className="mockup-top">
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="mockup-resume">

              <div className="mockup-name">
                ALEX MORGAN
              </div>

              <div className="mockup-title">
                SOFTWARE ENGINEER
              </div>

              <div className="mockup-line"></div>

              <h4>SUMMARY</h4>

              <p>
                Software engineer passionate about
                building scalable and user-friendly
                applications.
              </p>

              <h4>EXPERIENCE</h4>

              <div className="fake-line long"></div>
              <div className="fake-line"></div>
              <div className="fake-line medium"></div>

              <h4>PROJECTS</h4>

              <div className="fake-line long"></div>
              <div className="fake-line medium"></div>

              <h4>SKILLS</h4>

              <div className="skills-preview">
                <span>React</span>
                <span>JavaScript</span>
                <span>Python</span>
                <span>Git</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section
        className="features"
        id="features"
      >

        <div className="section-heading">

          <span>FEATURES</span>

          <h2>
            Everything you need to build
            <br />
            a better resume.
          </h2>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <Sparkles />
            </div>

            <h3>AI Suggestions</h3>

            <p>
              Improve your resume content with
              AI-powered suggestions and stronger
              wording.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <Eye />
            </div>

            <h3>Live Preview</h3>

            <p>
              See exactly how your resume looks while
              you build it.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <FileText />
            </div>

            <h3>Professional Templates</h3>

            <p>
              Choose from clean, modern and
              ATS-friendly resume templates.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how"
        id="how"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            From blank page to
            <br />
            job-ready resume.
          </h2>

        </div>


        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>

            <h3>Enter Your Details</h3>

            <p>
              Add your education, experience,
              projects and skills.
            </p>
          </div>


          <div className="step">
            <div className="step-number">02</div>

            <h3>Improve With AI</h3>

            <p>
              Turn basic descriptions into
              professional resume content.
            </p>
          </div>


          <div className="step">
            <div className="step-number">03</div>

            <h3>Download</h3>

            <p>
              Export your polished resume as a
              professional PDF.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="final-cta">

        <Sparkles size={28} />

        <h2>
          Your next opportunity starts
          with a better resume.
        </h2>

        <button
          className="primary-button"
          onClick={onStart}
        >
          Build My Resume
          <ArrowRight size={18} />
        </button>

      </section>


      <footer>
        © 2026 ResumeAI. Built with React.
      </footer>

    </div>
  );
}

export default LandingPage;