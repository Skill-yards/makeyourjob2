import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ResumePreviewPane from './ResumePreviewPane';

function ResumePreview({ template, formData }) {
  const navigate = useNavigate();

  const handleTextDownload = () => {
    const textContent = `
      ${formData.personal?.fullName || 'Your Name'}
      ${formData.personal?.email || 'your.email@example.com'}
      ${formData.personal?.phone || '(123) 456-7890'}
      ${formData.personal?.linkedin || ''}

      Professional Summary
      ${formData.summary?.summary || 'Your summary will appear here.'}

      Work Experience
      ${formData.experience?.map(job => `${job.title} | ${job.company}\n${job.startDate} - ${job.endDate || 'Present'}\n${job.responsibilities}`).join('\n\n') || 'Your experience will appear here.'}

      Education
      ${formData.education?.map(edu => `${edu.degree} | ${edu.institution}\nGraduated: ${edu.gradYear}`).join('\n\n') || 'Your education will appear here.'}

      Skills
      ${formData.skills?.map(skill => `- ${skill.skill}`).join('\n') || 'Your skills will appear here.'}

      Certifications
      ${formData.certifications?.map(cert => `${cert.name} | ${cert.organization}\nIssued: ${cert.issueDate}`).join('\n\n') || 'Your certifications will appear here.'}
    `;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    let y = 10;
    const lineHeight = 10;
    const maxWidth = 180;

    const addText = (text, isBold = false, isHeading = false) => {
      if (isBold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      doc.text(text, 10, y, { maxWidth });
      y += lineHeight * (isHeading ? 1.5 : 1);
    };

    if (formData.personal) {
      addText(formData.personal.fullName || 'Your Name', true, true);
      addText(formData.personal.email || 'your.email@example.com');
      addText(formData.personal.phone || '(123) 456-7890');
      if (formData.personal.linkedin) addText(formData.personal.linkedin);
      y += lineHeight;
    }

    if (formData.summary && formData.summary.summary) {
      addText('Professional Summary', true, true);
      addText(formData.summary.summary);
      y += lineHeight;
    }

    if (formData.experience && formData.experience.length > 0) {
      addText('Work Experience', true, true);
      formData.experience.forEach(job => {
        addText(`${job.title || 'Job Title'} | ${job.company || 'Company Name'}`, true);
        addText(`${job.startDate || 'Start Date'} - ${job.endDate || 'Present'}`);
        addText(job.responsibilities || 'Your responsibilities.');
        y += lineHeight;
      });
    }

    if (formData.education && formData.education.length > 0) {
      addText('Education', true, true);
      formData.education.forEach(edu => {
        addText(`${edu.degree || 'Degree'} | ${edu.institution || 'Institution'}`, true);
        addText(`Graduated: ${edu.gradYear || 'Year'}`);
        y += lineHeight;
      });
    }

    if (formData.skills && formData.skills.length > 0) {
      addText('Skills', true, true);
      formData.skills.forEach(skill => {
        addText(`- ${skill.skill}`);
      });
      y += lineHeight;
    }

    if (formData.certifications && formData.certifications.length > 0) {
      addText('Certifications', true, true);
      formData.certifications.forEach(cert => {
        addText(`${cert.name || 'Certification'} | ${cert.organization || 'Organization'}`, true);
        addText(`Issued: ${cert.issueDate || 'Date'}`);
        y += lineHeight;
      });
    }

    doc.save('resume.pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Resume Preview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Final Resume Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResumePreviewPane template={template} formData={formData} />
          <div className="flex space-x-4 mt-6 justify-center">
            <Button variant="outline" onClick={() => navigate('/resume-builder')}>
              Change Template
            </Button>
            <Button variant="outline" onClick={() => navigate('/resume-builder/input')}>
              Edit Information
            </Button>
            <Button onClick={handleTextDownload}>
              Download as Text
            </Button>
            <Button onClick={handlePdfDownload}>
              Download as PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResumePreview;