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
import {
  useCreateUserExperience,
  useGetExperiences,
} from '@/lib/api-hooks/experiences';
import { EmptyRecordCard } from '@/components/ui/empty-record-card';
import {
  CreateAndEditExperience,
  CreateResumeDialog,
  ExperienceCard,
} from './components';

export default function Experiences() {
  const { toast } = useToast();
  const router = useRouter();
  // const { data } = useGetExperiences();
  // const { mutate, isPending, isError, error } = useCreateUserExperience();

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
          <CreateResumeDialog
            open={isCreateResumeOpen}
            onOpenChange={setIsCreateResumeOpen}
            experiences={selectedExperiences}
            templates={[]}
            handleCreateResume={handleCreateResume}
            selectedExperiences={selectedExperiences}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onSelectAll={handleSelectAll}
          />
          <Button onClick={handleAddExperience}>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </div>

      {/* Add/Edit Experience Form */}
      {(isAddingExperience || editingExperience) && (
        <CreateAndEditExperience
          experience={selectedExperiences}
          actionType={'edit'}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="space-y-6">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            id={experience.id}
            company={experience.company}
            position={experience.position}
            description={experience.description}
            location={experience.location}
            startDate={experience.startDate}
            endDate={experience.endDate}
            onEdit={() => handleEditExperience(experience)}
            onDelete={() => handleDeleteExperience(experience.id)}
            technologies={experience.technologies}
            responsibilities={experience.responsibilities}
            achievements={experience.achievements}
          />
        ))}
      </div>

      {experiences.length === 0 && !isAddingExperience && (
        <EmptyRecordCard
          title={'No work experience yet'}
          description={
            'Start building your professional profile by adding your first work experience.'
          }
          buttonLabel={'Add Your First Experience'}
          onClick={handleAddExperience}
        />
      )}
    </div>
  );
}
