'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Briefcase,
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building,
  Code,
  Award,
  Users,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Path } from '@/lib/path';

export default function Experiences() {
  const { toast } = useToast();
  const router = useRouter();
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: 'TechCorp Solutions',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      description:
        'Led development of responsive web applications using React and TypeScript. Collaborated with cross-functional teams to deliver high-quality user experiences.',
      technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
      achievements: [
        'Improved application performance by 40%',
        'Led a team of 5 developers',
        'Reduced bug reports by 60%',
      ],
      responsibilities: [
        'Developed and maintained frontend applications',
        'Conducted code reviews and mentored junior developers',
        'Collaborated with UX/UI team on design implementation',
      ],
    },
    {
      id: 2,
      company: 'Digital Innovations Inc',
      position: 'Full Stack Developer',
      location: 'New York, NY',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      description:
        'Developed full-stack web applications for various clients. Worked with modern JavaScript frameworks and cloud technologies.',
      technologies: ['JavaScript', 'Vue.js', 'Python', 'PostgreSQL', 'MongoDB'],
      achievements: [
        'Delivered 15+ successful projects',
        'Increased client satisfaction by 35%',
        'Implemented CI/CD pipelines',
      ],
      responsibilities: [
        'Built RESTful APIs and frontend interfaces',
        'Managed database design and optimization',
        'Participated in agile development processes',
      ],
    },
  ]);

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperience, setEditingExperience] = useState<number | null>(
    null
  );
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isCreateResumeOpen, setIsCreateResumeOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: '',
    achievements: '',
    responsibilities: '',
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

  const handleAddExperience = () => {
    setIsAddingExperience(true);
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: '',
      achievements: '',
      responsibilities: '',
    });
  };

  const handleEditExperience = (experience: any) => {
    setEditingExperience(experience.id);
    setIsAddingExperience(false);
    setFormData({
      company: experience.company,
      position: experience.position,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      technologies: experience.technologies.join(', '),
      achievements: experience.achievements.join('\n'),
      responsibilities: experience.responsibilities.join('\n'),
    });
  };

  const handleSaveExperience = () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in company, position, and start date.',
        variant: 'destructive',
      });
      return;
    }

    const newExperience = {
      id: editingExperience || Date.now(),
      company: formData.company,
      position: formData.position,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.current ? 'Present' : formData.endDate,
      current: formData.current,
      description: formData.description,
      technologies: formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech),
      achievements: formData.achievements
        .split('\n')
        .filter((achievement) => achievement.trim()),
      responsibilities: formData.responsibilities
        .split('\n')
        .filter((responsibility) => responsibility.trim()),
    };

    if (editingExperience) {
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === editingExperience ? newExperience : exp))
      );
      toast({
        title: 'Experience updated',
        description: 'Your work experience has been updated successfully.',
      });
    } else {
      setExperiences((prev) => [...prev, newExperience]);
      toast({
        title: 'Experience added',
        description: 'Your work experience has been added successfully.',
      });
    }

    handleCancelEdit();
  };

  const handleDeleteExperience = (id: number) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    toast({
      title: 'Experience deleted',
      description: 'The work experience has been removed.',
    });
  };

  const handleCancelEdit = () => {
    setIsAddingExperience(false);
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: '',
      achievements: '',
      responsibilities: '',
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceSelection = (
    experienceId: number,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedExperiences((prev) => [...prev, experienceId]);
    } else {
      setSelectedExperiences((prev) =>
        prev.filter((id) => id !== experienceId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExperiences(experiences.map((exp) => exp.id));
    } else {
      setSelectedExperiences([]);
    }
  };

  const handleCreateResume = () => {
    if (selectedExperiences.length === 0) {
      toast({
        title: 'No experiences selected',
        description:
          'Please select at least one experience to create a resume.',
        variant: 'destructive',
      });
      return;
    }

    const selectedData = experiences.filter((exp) =>
      selectedExperiences.includes(exp.id)
    );

    // Store the data in sessionStorage for the resume builder to use
    sessionStorage.setItem(
      'resumeBuilderData',
      JSON.stringify({
        template: selectedTemplate,
        experiences: selectedData,
        source: 'experiences',
      })
    );

    toast({
      title: 'Resume creation started',
      description: `Creating resume with ${selectedExperiences.length} experience(s) using ${templates.find((t) => t.id === selectedTemplate)?.name} template.`,
    });

    setIsCreateResumeOpen(false);
    router.push(Path.Client.Protected.Builder);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Work Experience
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your professional work history
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isCreateResumeOpen}
            onOpenChange={setIsCreateResumeOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" disabled={experiences.length === 0}>
                <FileText className="mr-2 h-4 w-4" />
                Create Resume from Experiences
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Create Resume from Experiences
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">
                    Choose Template
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer border transition-all ${
                          selectedTemplate === template.id
                            ? 'shadow-lg ring-2 ring-primary'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="pt-6">
                          <div className="mb-3 flex aspect-[8.5/11] items-center justify-center rounded bg-muted/30">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <h4 className="font-semibold text-foreground">
                            {template.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {template.preview}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Experience Selection */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Select Experiences to Include
                    </h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="selectAll"
                        checked={
                          selectedExperiences.length === experiences.length &&
                          experiences.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                      <Label htmlFor="selectAll" className="text-sm">
                        Select All
                      </Label>
                    </div>
                  </div>

                  <div className="max-h-60 space-y-3 overflow-y-auto">
                    {experiences.map((experience) => (
                      <Card key={experience.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`exp-${experience.id}`}
                            checked={selectedExperiences.includes(
                              experience.id
                            )}
                            onCheckedChange={(checked) =>
                              handleExperienceSelection(
                                experience.id,
                                checked as boolean
                              )
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`exp-${experience.id}`}
                              className="cursor-pointer"
                            >
                              <div className="mb-2 flex items-center gap-3">
                                <Building className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-foreground">
                                  {experience.company}
                                </h4>
                              </div>
                              <div className="mb-2 flex items-center gap-2">
                                <Briefcase className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                  {experience.position}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{experience.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {experience.startDate} -{' '}
                                    {experience.endDate}
                                  </span>
                                </div>
                              </div>
                              {experience.technologies.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {experience.technologies
                                    .slice(0, 3)
                                    .map((tech, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  {experience.technologies.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{experience.technologies.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </Label>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateResumeOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateResume}
                    disabled={selectedExperiences.length === 0}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Create Resume ({selectedExperiences.length} selected)
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleAddExperience}>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </div>

      {/* Add/Edit Experience Form */}
      {(isAddingExperience || editingExperience) && (
        <Card className="border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Briefcase className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange('company', e.target.value)
                    }
                    placeholder="e.g. TechCorp Solutions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange('position', e.target.value)
                    }
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange('startDate', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="month"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange('endDate', e.target.value)
                      }
                      disabled={formData.current}
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Award className="h-5 w-5" />
                  Experience Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Brief overview of your role and responsibilities..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies Used</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) =>
                      handleInputChange('technologies', e.target.value)
                    }
                    placeholder="React, TypeScript, Node.js, AWS (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) =>
                      handleInputChange('achievements', e.target.value)
                    }
                    placeholder="• Improved performance by 40%&#10;• Led team of 5 developers&#10;• Reduced bugs by 60%"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) =>
                      handleInputChange('responsibilities', e.target.value)
                    }
                    placeholder="• Developed frontend applications&#10;• Conducted code reviews&#10;• Mentored junior developers"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveExperience}>
                <Save className="mr-2 h-4 w-4" />
                {editingExperience ? 'Update' : 'Save'} Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiences List */}
      <div className="space-y-6">
        {experiences.map((experience) => (
          <Card
            key={experience.id}
            className="border shadow-card transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="pt-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">
                      {experience.company}
                    </h3>
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold text-foreground">
                      {experience.position}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{experience.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {experience.startDate} - {experience.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditExperience(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {experience.description && (
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {experience.description}
                </p>
              )}

              {experience.technologies.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Technologies
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="border-primary/20 bg-primary/10 text-primary"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {experience.responsibilities.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Responsibilities
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {experience.responsibilities.map(
                        (responsibility, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1 text-primary">•</span>
                            <span>{responsibility}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {experience.achievements.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Key Achievements
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1 text-success">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && !isAddingExperience && (
        <Card className="border shadow-card">
          <CardContent className="pb-20 pt-20 text-center">
            <Briefcase className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No work experience yet
            </h3>
            <p className="mb-6 text-muted-foreground">
              Start building your professional profile by adding your first work
              experience.
            </p>
            <Button onClick={handleAddExperience}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
