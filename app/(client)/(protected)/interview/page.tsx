'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  Clock,
  ChevronRight,
  Plus,
  Trash2,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function Interviews() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedPrep, setSelectedPrep] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(true);

  // Mock interview history data
  const interviewHistory = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp',
      interviewer: 'Sarah Chen',
      interviewerAvatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-15',
      time: '2:30 PM',
      duration: '45 min',
      score: 85,
      questionsAnswered: 8,
      totalQuestions: 10,
      feedback:
        'Strong technical skills, good communication style. Could improve on behavioral questions.',
      strengths: ['Technical knowledge', 'Problem-solving', 'Communication'],
      improvements: ['STAR method usage', 'More specific examples'],
      status: 'completed',
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      interviewer: 'Michael Rodriguez',
      interviewerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-14',
      time: '10:15 AM',
      duration: '38 min',
      score: 92,
      questionsAnswered: 12,
      totalQuestions: 12,
      feedback:
        'Excellent product sense and leadership examples. Very well prepared.',
      strengths: ['Product strategy', 'Leadership', 'Data analysis'],
      improvements: ['Market research examples'],
      status: 'completed',
    },
    {
      id: 3,
      jobTitle: 'Digital Marketing Manager',
      company: 'MarketingPro',
      interviewer: 'Emily Johnson',
      interviewerAvatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      date: '2024-01-13',
      time: '4:45 PM',
      duration: '52 min',
      score: 78,
      questionsAnswered: 7,
      totalQuestions: 10,
      feedback: 'Good campaign knowledge, needs more metrics and ROI examples.',
      strengths: ['Campaign planning', 'Creative thinking'],
      improvements: ['Quantifiable results', 'ROI analysis'],
      status: 'completed',
    },
  ];

  const handleViewPrep = (prep: any) => {
    setSelectedPrep(prep);
    setShowHistory(false);
  };

  const handleDeletePrep = (prepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Interview prep deleted',
      description: 'The interview prep has been removed from your history.',
    });
  };

  const handleBackToHistory = () => {
    setSelectedPrep(null);
    setShowHistory(true);
  };

  const handleNewPrep = () => {
    router.push('/interview/new');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Interview Preparation
          </h1>
          <p className="text-xl text-muted-foreground">
            Your interview practice history and results
          </p>
        </div>
        <Button onClick={handleNewPrep}>
          <Plus className="mr-2 h-4 w-4" />
          New Interview Prep
        </Button>
      </div>

      {/* Interview History */}
      {showHistory && (
        <Card className="border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Interview History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interviewHistory.length > 0 ? (
              <div className="space-y-3">
                {interviewHistory.map((prep) => (
                  <div
                    key={prep.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    onClick={() => handleViewPrep(prep)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {prep.jobTitle}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {prep.company} • {prep.interviewer} • {prep.date} at{' '}
                          {prep.time}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Duration: {prep.duration} • {prep.questionsAnswered}/
                          {prep.totalQuestions} questions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${getScoreColor(prep.score)}`}
                        >
                          {prep.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeletePrep(prep.id, e)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mb-4 text-muted-foreground">
                  No interview history yet. Start your first practice session!
                </p>
                <Button onClick={handleNewPrep}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Your First Interview Prep
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interview Details */}
      {!showHistory && selectedPrep && (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Interview Info */}
          <div className="space-y-6 md:col-span-2">
            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Interview Details
                  <Button variant="ghost" onClick={handleBackToHistory}>
                    <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                    Back to History
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {selectedPrep.jobTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPrep.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPrep.date} at {selectedPrep.time} • Duration:{' '}
                      {selectedPrep.duration}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/30 p-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {selectedPrep.questionsAnswered}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Questions Answered
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {selectedPrep.totalQuestions}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Questions
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {selectedPrep.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Interviewer Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedPrep.interviewerAvatar}
                      alt={selectedPrep.interviewer}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {selectedPrep.interviewer}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        AI Interview Coach
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {selectedPrep.feedback}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-success" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPrep.strengths.map(
                      (strength: string, index: number) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-success/20 bg-success/5 p-3"
                        >
                          <Star className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                          <p className="text-sm text-foreground">{strength}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-warning" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPrep.improvements.map(
                      (improvement: string, index: number) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3"
                        >
                          <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
                          <p className="text-sm text-foreground">
                            {improvement}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Score and Actions */}
          <div className="space-y-6">
            <Card className="border bg-primary/5 shadow-card">
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div className="text-6xl font-bold text-primary">
                    {selectedPrep.score}%
                  </div>
                  <p className="text-muted-foreground">Overall Performance</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Interviewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <img
                    src={selectedPrep.interviewerAvatar}
                    alt={selectedPrep.interviewer}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {selectedPrep.interviewer}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      AI Interview Coach
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push('/interview/new')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Start New Interview Prep
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
