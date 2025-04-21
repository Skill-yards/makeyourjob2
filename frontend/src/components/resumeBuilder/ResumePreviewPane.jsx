function ResumePreviewPane({ template, formData }) {
    const layoutClass = template?.layout === 'Single Column' ? 'mx-auto max-w-xl' : 'grid grid-cols-2 gap-4';
    const templateStyles = {
      Modern: { font: 'font-sans', headingColor: 'text-blue-600', divider: 'border-blue-200' },
      Minimalist: { font: 'font-serif', headingColor: 'text-gray-800', divider: 'border-gray-200' },
      Professional: { font: 'font-sans', headingColor: 'text-black', divider: 'border-gray-300' },
    };
    const style = template ? templateStyles[template.name] : templateStyles.Modern;
  
    const hasPersonal = formData.personal && Object.values(formData.personal).some(val => val);
    const hasSummary = formData.summary && formData.summary.summary;
    const hasExperience = formData.experience && formData.experience.length > 0 && formData.experience.some(job => Object.values(job).some(val => val));
    const hasEducation = formData.education && formData.education.length > 0 && formData.education.some(edu => Object.values(edu).some(val => val));
    const hasSkills = formData.skills && formData.skills.length > 0 && formData.skills.some(skill => skill.skill);
    const hasCertifications = formData.certifications && formData.certifications.length > 0 && formData.certifications.some(cert => Object.values(cert).some(val => val));
  
    return (
      <div className="border p-4 h-[calc(100vh-12rem)] overflow-auto bg-white">
        <div className={`${layoutClass} ${style.font} text-foreground`}>
          <h2 className={`text-2xl font-bold mb-4 border-b pb-2 ${style.divider}`}>
            {formData.personal?.fullName || 'Your Name'}
          </h2>
          {hasPersonal && (
            <div className="mb-6">
              <p>{formData.personal.email || 'your.email@example.com'}</p>
              <p>{formData.personal.phone || '(123) 456-7890'}</p>
              {formData.personal.linkedin && <p>{formData.personal.linkedin}</p>}
            </div>
          )}
          {hasSummary && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold border-b pb-1 ${style.headingColor} ${style.divider}`}>
                Professional Summary
              </h3>
              <p className="mt-2">{formData.summary.summary}</p>
            </div>
          )}
          {hasExperience && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold border-b pb-1 ${style.headingColor} ${style.divider}`}>
                Work Experience
              </h3>
              {formData.experience.map((job, index) => (
                <div key={index} className="mt-2">
                  <p className="font-medium">
                    {job.title || 'Job Title'} | {job.company || 'Company Name'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {job.startDate || 'Start Date'} - {job.endDate || 'Present'}
                  </p>
                  <p className="mt-1">{job.responsibilities || 'Your responsibilities.'}</p>
                </div>
              ))}
            </div>
          )}
          {hasEducation && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold border-b pb-1 ${style.headingColor} ${style.divider}`}>
                Education
              </h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="mt-2">
                  <p className="font-medium">
                    {edu.degree || 'Degree'} | {edu.institution || 'Institution'}
                  </p>
                  <p className="text-sm text-muted-foreground">Graduated: {edu.gradYear || 'Year'}</p>
                </div>
              ))}
            </div>
          )}
          {hasSkills && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold border-b pb-1 ${style.headingColor} ${style.divider}`}>
                Skills
              </h3>
              <ul className="list-disc pl-5 mt-2">
                {formData.skills.map((skill, index) => (
                  <li key={index}>{skill.skill}</li>
                ))}
              </ul>
            </div>
          )}
          {hasCertifications && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold border-b pb-1 ${style.headingColor} ${style.divider}`}>
                Certifications
              </h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="mt-2">
                  <p className="font-medium">
                    {cert.name || 'Certification'} | {cert.organization || 'Organization'}
                  </p>
                  <p className="text-sm text-muted-foreground">Issued: {cert.issueDate || 'Date'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default ResumePreviewPane;