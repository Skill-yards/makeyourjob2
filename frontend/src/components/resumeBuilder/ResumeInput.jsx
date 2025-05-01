import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ResumePreviewPane from './ResumePreviewPane';

function ResumeInput({ template, formData, setFormData }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showFields, setShowFields] = useState(false);
  const [sectionData, setSectionData] = useState({});
  const [errors, setErrors] = useState({});
  const [showStepPreview, setShowStepPreview] = useState(false);

  const suggestions = {
    summary: [
      'Results-driven professional with over 5 years of experience in project management.',
      'Detail-oriented software engineer skilled in full-stack development.',
    ],
    responsibilities: [
      'Led a team of 10 to deliver projects on time and within budget.',
      'Developed and maintained web applications using React and Node.js.',
    ],
    skill: ['JavaScript', 'Project Management', 'Python', 'Communication'],
  };

  const steps = [
    {
      question: 'Do you want to include personal contact information on your resume?',
      section: 'personal',
      fields: [
        { name: 'fullName', label: 'Full Name', type: 'text', required: true, tip: 'Use your full legal name.' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, tip: 'Use a professional email address.' },
        { name: 'phone', label: 'Phone Number', type: 'text', required: false, tip: 'Include a reachable phone number.' },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'text', required: false, tip: 'Add your LinkedIn profile.' },
      ],
    },
    {
      question: 'Would you like to include a professional summary?',
      section: 'summary',
      fields: [
        { name: 'summary', label: 'Professional Summary', type: 'textarea', required: true, tip: 'Summarize your experience in 2-3 sentences.', suggestions: suggestions.summary },
      ],
    },
    {
      question: 'Do you have work experience to include?',
      section: 'experience',
      fields: [
        { name: 'title', label: 'Job Title', type: 'text', required: true, tip: 'Use the exact job title.' },
        { name: 'company', label: 'Company Name', type: 'text', required: true, tip: 'Include the full company name.' },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true, tip: 'Enter in MM/YYYY format.' },
        { name: 'endDate', label: 'End Date', type: 'date', required: false, tip: 'Leave blank if currently employed.' },
        { name: 'responsibilities', label: 'Responsibilities', type: 'textarea', required: true, tip: 'Use action verbs (e.g., led, developed).', suggestions: suggestions.responsibilities },
      ],
      repeatable: true,
    },
    {
      question: 'Do you want to include your educational background?',
      section: 'education',
      fields: [
        { name: 'degree', label: 'Degree', type: 'text', required: true, tip: 'E.g., Bachelor of Science.' },
        { name: 'institution', label: 'Institution Name', type: 'text', required: true, tip: 'Include the full institution name.' },
        { name: 'gradYear', label: 'Graduation Year', type: 'number', required: true, tip: 'Enter the graduation year.' },
      ],
      repeatable: true,
    },
    {
      question: 'Would you like to list specific skills on your resume?',
      section: 'skills',
      fields: [
        { name: 'skill', label: 'Skill Name', type: 'text', required: true, tip: 'Choose relevant skills.', suggestions: suggestions.skill },
      ],
      repeatable: true,
    },
    {
      question: 'Do you have any certifications to include?',
      section: 'certifications',
      fields: [
        { name: 'name', label: 'Certification Name', type: 'text', required: true, tip: 'E.g., AWS Certified Solutions Architect.' },
        { name: 'organization', label: 'Issuing Organization', type: 'text', required: true, tip: 'E.g., Amazon Web Services.' },
        { name: 'issueDate', label: 'Issue Date', type: 'date', required: true, tip: 'Enter the issue date.' },
      ],
      repeatable: true,
    },
  ];

  const current = steps[currentStep];

  const handleAnswer = (answer) => {
    if (answer === 'no') {
      setFormData({ ...formData, [current.section]: null });
      goToNextStep();
    } else {
      setShowFields(true);
      setSectionData(current.repeatable ? (formData[current.section] || [{}]) : (formData[current.section] || {}));
    }
  };

  const handleInputChange = (e, index, fieldName) => {
    const { value } = e.target;
    let newSectionData;
    if (current.repeatable) {
      newSectionData = [...sectionData];
      newSectionData[index] = { ...newSectionData[index], [fieldName]: value };
    } else {
      newSectionData = { ...sectionData, [fieldName]: value };
    }
    setSectionData(newSectionData);
    setFormData({ ...formData, [current.section]: newSectionData });
  };

  const handleSuggestionClick = (suggestion, index, fieldName) => {
    let newSectionData;
    if (current.repeatable) {
      newSectionData = [...sectionData];
      newSectionData[index] = { ...newSectionData[index], [fieldName]: suggestion };
    } else {
      newSectionData = { ...sectionData, [fieldName]: suggestion };
    }
    setSectionData(newSectionData);
    setFormData({ ...formData, [current.section]: newSectionData });
  };

  const addEntry = () => {
    if (current.repeatable) {
      const newSectionData = [...sectionData, {}];
      setSectionData(newSectionData);
      setFormData({ ...formData, [current.section]: newSectionData });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (current.repeatable) {
      sectionData.forEach((entry, index) => {
        current.fields.forEach((field) => {
          if (field.required && !entry[field.name]) {
            newErrors[`${field.name}-${index}`] = `${field.label} is required`;
          }
        });
      });
    } else {
      current.fields.forEach((field) => {
        if (field.required && !sectionData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowFields(false);
      setSectionData({});
    } else {
      navigate('/resume-builder/preview');
    }
  };

  const handleNext = () => {
    if (validateFields()) {
      setFormData({ ...formData, [current.section]: sectionData });
      setShowStepPreview(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowFields(false);
      setSectionData(
        current.repeatable
          ? (formData[steps[currentStep - 1].section] || [{}])
          : (formData[steps[currentStep - 1].section] || {})
      );
    } else {
      // Stay on /input since there's no template selection
      setCurrentStep(0);
      setShowFields(false);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Build Your Professional Resume</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{current.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Step {currentStep + 1} of {steps.length}
          </p>
          {!showFields ? (
            <div className="flex space-x-4">
              <Button onClick={() => handleAnswer('yes')}>
                Yes
              </Button>
              <Button variant="outline" onClick={() => handleAnswer('no')}>
                No
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {current.repeatable ? (
                sectionData.map((entry, index) => (
                  <div key={index} className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Entry {index + 1}</h3>
                    {current.fields.map((field) => (
                      <div key={field.name} className="mb-4">
                        <Label>{field.label}</Label>
                        <p className="text-sm text-muted-foreground mb-2">{field.tip}</p>
                        {field.type === 'textarea' ? (
                          <>
                            {field.suggestions && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {field.suggestions.map((suggestion, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSuggestionClick(suggestion, index, field.name)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                            <Textarea
                              name={field.name}
                              value={entry[field.name] || ''}
                              onChange={(e) => handleInputChange(e, index, field.name)}
                              rows={4}
                            />
                          </>
                        ) : (
                          <Input
                            type={field.type}
                            name={field.name}
                            value={entry[field.name] || ''}
                            onChange={(e) => handleInputChange(e, index, field.name)}
                          />
                        )}
                        {field.suggestions && field.type !== 'textarea' && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion, index, field.name)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        {errors[`${field.name}-${index}`] && (
                          <p className="text-destructive text-sm">{errors[`${field.name}-${index}`]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                current.fields.map((field) => (
                  <div key={field.name} className="mb-4">
                    <Label>{field.label}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{field.tip}</p>
                    {field.type === 'textarea' ? (
                      <>
                        {field.suggestions && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {field.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion, 0, field.name)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        <Textarea
                          name={field.name}
                          value={sectionData[field.name] || ''}
                          onChange={(e) => handleInputChange(e, 0, field.name)}
                          rows={4}
                        />
                      </>
                    ) : (
                      <Input
                        type={field.type}
                        name={field.name}
                        value={sectionData[field.name] || ''}
                        onChange={(e) => handleInputChange(e, 0, field.name)}
                      />
                    )}
                    {field.suggestions && field.type !== 'textarea' && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion, 0, field.name)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    {errors[field.name] && (
                      <p className="text-destructive text-sm">{errors[field.name]}</p>
                    )}
                  </div>
                ))
              )}
              {current.repeatable && (
                <Button onClick={addEntry} className="mt-2">
                  Add Another
                </Button>
              )}
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Preview
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showStepPreview} onOpenChange={() => setShowStepPreview(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Step {currentStep + 1} Preview</DialogTitle>
          </DialogHeader>
          <ResumePreviewPane template={template} formData={formData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStepPreview(false)}>
              Back to Editing
            </Button>
            <Button onClick={() => { setShowStepPreview(false); goToNextStep(); }}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResumeInput;