import {
  Mail,
  Phone,
  MapPin,
  Link,
} from "lucide-react";

function ResumePreview({ resume, template }) {

  return (
    <div className={`resume-wrapper ${template}`}>

      <div
        className="resume-paper"
        id="resume-preview"
      >

        {/* HEADER */}

        <header className="resume-header">

          <h1>
            {resume.personal.name}
          </h1>

          <h2>
            {resume.personal.title}
          </h2>

          <div className="contact-info">

            <span>
              <Mail size={11} />
              {resume.personal.email}
            </span>

            <span>
              <Phone size={11} />
              {resume.personal.phone}
            </span>

            <span>
              <MapPin size={11} />
              {resume.personal.location}
            </span>

          </div>


          <div className="contact-info">

            <span>
              <Link size={11} />
              {resume.personal.linkedin}
            </span>

            <span>
              <Link size={11} />
              {resume.personal.github}
            </span>

          </div>

        </header>


        {/* SUMMARY */}

        <ResumeSection title="SUMMARY">

          <p>
            {resume.summary}
          </p>

        </ResumeSection>


        {/* EXPERIENCE */}

        {resume.experience.length > 0 && (

          <ResumeSection title="EXPERIENCE">

            {resume.experience.map(
              (experience, index) => (

                <div
                  className="resume-item"
                  key={index}
                >

                  <div className="item-header">

                    <div>

                      <h3>
                        {experience.position}
                      </h3>

                      <strong>
                        {experience.company}
                      </strong>

                    </div>

                    <span>
                      {experience.start} –{" "}
                      {experience.end}
                    </span>

                  </div>

                  <p>
                    {experience.description}
                  </p>

                </div>

              )
            )}

          </ResumeSection>

        )}


        {/* PROJECTS */}

        {resume.projects.length > 0 && (

          <ResumeSection title="PROJECTS">

            {resume.projects.map(
              (project, index) => (

                <div
                  className="resume-item"
                  key={index}
                >

                  <div className="item-header">

                    <h3>
                      {project.name}
                    </h3>

                    <span>
                      {project.link}
                    </span>

                  </div>

                  <p>
                    {project.description}
                  </p>

                  <div className="project-tech">
                    {project.technologies}
                  </div>

                </div>

              )
            )}

          </ResumeSection>

        )}


        {/* EDUCATION */}

        {resume.education.length > 0 && (

          <ResumeSection title="EDUCATION">

            {resume.education.map(
              (education, index) => (

                <div
                  className="resume-item"
                  key={index}
                >

                  <div className="item-header">

                    <div>

                      <h3>
                        {education.degree}
                      </h3>

                      <strong>
                        {education.institution}
                      </strong>

                    </div>

                    <span>
                      {education.start} –{" "}
                      {education.end}
                    </span>

                  </div>

                  <p>
                    {education.grade}
                  </p>

                </div>

              )
            )}

          </ResumeSection>

        )}


        {/* SKILLS */}

        <ResumeSection title="SKILLS">

          <div className="resume-skills">

            {resume.skills.map(
              (skill, index) => (

                <span key={index}>
                  {skill}
                </span>

              )
            )}

          </div>

        </ResumeSection>

      </div>

    </div>
  );
}


function ResumeSection({ title, children }) {

  return (
    <section className="resume-section">

      <h2>
        {title}
      </h2>

      {children}

    </section>
  );
}


export default ResumePreview;