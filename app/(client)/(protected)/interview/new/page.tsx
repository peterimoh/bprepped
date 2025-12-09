'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  MessageSquare,
  ArrowLeft,
  Sparkles,
  User,
  Briefcase,
  Award,
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Path, createPath } from '@/lib/path';

export default function New() {
  const { toast } = useToast();
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const interviewers = [
    {
      id: 'sarah',
      name: 'Sarah Chen',
      title: 'Senior Technical Recruiter',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      company: 'TechCorp',
      experience: '8+ years',
      specialty: 'Technical interviews',
      description:
        'Specializes in frontend and full-stack technical interviews with focus on problem-solving and system design.',
    },
    {
      id: 'michael',
      name: 'Michael Rodriguez',
      title: 'Product Lead',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      company: 'StartupXYZ',
      experience: '10+ years',
      specialty: 'Product management',
      description:
        'Expert in product strategy, user research, and cross-functional leadership interviews.',
    },
    {
      id: 'emily',
      name: 'Emily Johnson',
      title: 'Marketing Director',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      company: 'MarketingPro',
      experience: '12+ years',
      specialty: 'Digital marketing',
      description:
        'Focuses on campaign strategy, analytics, and brand management interview scenarios.',
    },
  ];

  const handleStartInterview = () => {
    if (!jobTitle || !jobDescription || !selectedInterviewer) {
      toast({
        title: 'Missing information',
        description: 'Please provide job details and select an interviewer.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    // Simulate AI preparation
    setTimeout(() => {
      setIsGenerating(false);
      router.push(
        createPath.interviewSession(jobTitle, selectedInterviewer)
      );
      toast({
        title: 'Interview session ready!',
        description: '25 tokens used for session setup.',
      });
    }, 2000);
  };

  const handleBack = () => {
    router.push(Path.Client.Protected.Interview.Root);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            New Interview Prep
          </h1>
          <p className="text-xl text-muted-foreground">
            Set up your practice interview session
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Job Details */}
        <div className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={handleStartInterview}
            disabled={
              isGenerating ||
              !jobTitle ||
              !jobDescription ||
              !selectedInterviewer
            }
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Preparing Interview...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Interview Session (25 tokens)
              </>
            )}
          </Button>
        </div>

        {/* Interviewer Selection */}
        <div className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Interviewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedInterviewer}
                onValueChange={setSelectedInterviewer}
              >
                <div className="space-y-4">
                  {interviewers.map((interviewer) => (
                    <div key={interviewer.id} className="space-y-2">
                      <RadioGroupItem
                        value={interviewer.id}
                        id={interviewer.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={interviewer.id}
                        className="flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <img
                          src={interviewer.avatar}
                          alt={interviewer.name}
                          className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">
                              {interviewer.name}
                            </h4>
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                              {interviewer.experience}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {interviewer.title} at {interviewer.company}
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {interviewer.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Award className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">
                              {interviewer.specialty}
                            </span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
