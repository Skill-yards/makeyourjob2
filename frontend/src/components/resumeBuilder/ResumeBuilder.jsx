import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResumeInput from './ResumeInput';
import ResumePreview from './ResumePreview';

function ResumeBuilder() {
  // Set a default template (e.g., Modern)
  const [template, setTemplate] = useState({
    id: 1,
    name: 'Modern',
    layout: 'Single Column',
    style: 'Clean, bold headings with minimal color accents',
    atsFriendly: true,
  });
  const [formData, setFormData] = useState({});

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Redirect root path to /input */}
        <Route path="/" element={<Navigate to="/input" />} />
        <Route
          path="/input"
          element={<ResumeInput template={template} formData={formData} setFormData={setFormData} />}
        />
        <Route
          path="/preview"
          element={<ResumePreview template={template} formData={formData} />}
        />
      </Routes>
    </div>
  );
}

export default ResumeBuilder;