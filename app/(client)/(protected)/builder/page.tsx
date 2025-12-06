'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Builder(){
  const { toast } = useToast();
  const [template, setTemplate] = useState('modern');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  });

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      preview: 'Clean and contemporary',
    },
    {
      id: 'classic',
      name: 'Classic ATS',
      preview: 'Traditional and ATS-optimized',
    },
    { id: 'creative', name: 'Creative Edge', preview: 'Stand out with style' },
  ];

  // Load pre-filled data from experiences page
  useEffect(() => {
    const savedData = sessionStorage.getItem('resumeBuilderData');
    if (savedData) {
      const data = JSON.parse(savedData);

      // Set template if provided
      if (data.template) {
        setTemplate(data.template);
      }

      // Pre-fill experience section with selected experiences
      if (data.experiences && data.experiences.length > 0) {
        const experienceText = data.experiences
          .map((exp: any) => {
            const dates = `${exp.startDate} - ${exp.endDate}`;
            const location = exp.location ? `${exp.location} | ` : '';
            const tech =
              exp.technologies.length > 0
                ? `\n\nTechnologies: ${exp.technologies.join(', ')}`
                : '';
            const achievements =
              exp.achievements.length > 0
                ? `\n\nKey Achievements:\n${exp.achievements.map((ach: string) => `• ${ach}`).join('\n')}`
                : '';
            const responsibilities =
              exp.responsibilities.length > 0
                ? `\n\nResponsibilities:\n${exp.responsibilities.map((resp: string) => `• ${resp}`).join('\n')}`
                : '';

            return `${exp.company} | ${exp.position} | ${location}${dates}

${exp.description || ''}${tech}${achievements}${responsibilities}`;
          })
          .join('\n\n---\n\n');

        setFormData((prev) => ({
          ...prev,
          experience: experienceText,
        }));

        // Show success message
        toast({
          title: 'Resume pre-filled from experiences',
          description: `Added ${data.experiences.length} experience(s) to your resume. You can edit them below.`,
        });

        // Clear the session data
        sessionStorage.removeItem('resumeBuilderData');
      }
    }
  }, [toast]);

  const handleSave = () => {
    toast({
      title: 'Resume saved!',
      description: 'Your resume has been saved successfully.',
    });
  };

  const handleDownload = () => {
    toast({
      title: 'Download started',
      description: 'Your resume is being exported as PDF...',
    });
  };

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-foreground">
              Resume Builder
            </h1>
            <p className="text-xl text-muted-foreground">
              Create your ATS-compliant resume
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <Card className="border shadow-card">
          <CardHeader>
            <CardTitle>Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((t) => (
                <Card
                  key={t.id}
                  className={`cursor-pointer border transition-all ${
                    template === t.id
                      ? 'shadow-lg ring-2 ring-primary'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setTemplate(t.id)}
                >
                  <CardContent className="pt-6">
                    <div className="mb-3 flex aspect-[8.5/11] items-center justify-center rounded bg-muted/30">
                      <span className="text-sm text-muted-foreground">
                        {t.preview}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{t.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume Form */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Brief overview of your professional background and goals..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  placeholder="List your work experience, achievements, and responsibilities..."
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  placeholder="Your educational background..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  placeholder="List your relevant skills..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] overflow-auto rounded-lg border-2 border-border bg-background p-4">
                  <div className="space-y-4 text-sm">
                    {formData.fullName && (
                      <h2 className="text-2xl font-bold text-foreground">
                        {formData.fullName}
                      </h2>
                    )}
                    {(formData.email || formData.phone) && (
                      <div className="text-muted-foreground">
                        {formData.email && <p>{formData.email}</p>}
                        {formData.phone && <p>{formData.phone}</p>}
                      </div>
                    )}
                    {formData.summary && (
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          Summary
                        </h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                          {formData.summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
