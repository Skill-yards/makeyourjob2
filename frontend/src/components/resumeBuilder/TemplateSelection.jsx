import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

function TemplateSelection({ setTemplate }) {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(null);

  const templates = [
    { id: 1, name: 'Modern', layout: 'Single Column', style: 'Clean, bold headings with minimal color accents', atsFriendly: true },
    { id: 2, name: 'Minimalist', layout: 'Single Column', style: 'Sleek, monochrome design with ample white space', atsFriendly: true },
    { id: 3, name: 'Professional', layout: 'Two Column', style: 'Structured layout with subtle dividers', atsFriendly: true },
  ];

  const handleSelect = (template) => {
    setTemplate(template);
    navigate('/resume-builder/input');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose a Resume Template</h1>
      <p className="text-muted-foreground mb-4 text-center">Select a Canva-inspired, ATS-friendly template to create your resume.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <p className="text-sm text-muted-foreground">{template.layout}</p>
              <p className="text-sm text-muted-foreground">{template.style}</p>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(template)}>
                  Preview
                </Button>
                <Button onClick={() => handleSelect(template)}>
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showPreview?.name} Preview</DialogTitle>
          </DialogHeader>
          <div className="border p-4 h-96 overflow-auto">
            <div className={showPreview?.layout === 'Single Column' ? 'mx-auto max-w-xl' : 'grid grid-cols-2 gap-4'}>
              <h3 className="text-xl font-bold">John Doe</h3>
              <p>Email: john.doe@example.com</p>
              <p>Experience: Software Engineer at Tech Corp</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(null)}>
              Close
            </Button>
            <Button onClick={() => handleSelect(showPreview)}>
              Select This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TemplateSelection;