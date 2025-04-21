import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplateSelection from './TemplateSelection';
import ResumeInput from './ResumeInput';
import ResumePreview from './ResumePreview';

function ResumeBuilder() {
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={<TemplateSelection setTemplate={setTemplate} />}
        />
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