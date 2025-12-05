'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Scan,
  MessageSquare,
  Plus,
  Coins,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const stats = [
    {
      label: 'Resumes Created',
      value: '3',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%',
    },
    {
      label: 'Scans Performed',
      value: '7',
      icon: Scan,
      color: 'from-purple-500 to-pink-500',
      trend: '+25%',
    },
    {
      label: 'Interview Preps',
      value: '2',
      icon: MessageSquare,
      color: 'from-green-500 to-teal-500',
      trend: '+8%',
    },
  ];

  const recentResumes = [
    {
      id: 1,
      title: 'Software Engineer Resume',
      template: 'Modern',
      lastEdited: '2 hours ago',
      score: 85,
    },
    {
      id: 2,
      title: 'Product Manager CV',
      template: 'Professional',
      lastEdited: '1 day ago',
      score: 92,
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      template: 'Creative',
      lastEdited: '3 days ago',
      score: 78,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 text-white md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-white/90">
              Welcome back to ResumeAI
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Ready to land your dream job?
          </h1>
          <p className="max-w-2xl text-lg text-white/80 md:text-xl">
            Your AI-powered career companion is here to help you create standout
            resumes and ace every interview.
          </p>
        </div>
      </div>

      {/* Token Balance Card with Enhanced Design */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 opacity-30 blur-3xl"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 shadow-lg">
                  <Coins className="h-7 w-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Token Balance
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Use tokens for AI-powered features and optimizations
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push('/tokens')}
              className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
            >
              Buy Tokens
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-6xl font-bold text-transparent">
                  150
                </span>
                <span className="text-xl text-muted-foreground">
                  / 200 tokens
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">75% used</span>
              </div>
            </div>
            <div className="relative">
              <Progress
                value={75}
                className="h-4 bg-amber-100 dark:bg-amber-950/30"
              />
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity duration-500 group-hover:opacity-10`}
            ></div>
            <CardContent className="relative pb-6 pt-8">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`rounded-2xl bg-gradient-to-br p-4 ${stat.color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          onClick={() => router.push('/builder')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
          <CardContent className="relative pb-8 pt-10 text-center">
            <div className="mx-auto mb-6 w-fit rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
              <Plus className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-blue-600">
              Create New Resume
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Start building with ATS-optimized templates
            </p>
          </CardContent>
        </Card>
        <Card
          className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          onClick={() => router.push('/scanner')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
          <CardContent className="relative pb-8 pt-10 text-center">
            <div className="mx-auto mb-6 w-fit rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
              <Scan className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-purple-600">
              Scan Resume
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Match with job descriptions instantly
            </p>
          </CardContent>
        </Card>
        <Card
          className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          onClick={() => router.push('/interview')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
          <CardContent className="relative pb-8 pt-10 text-center">
            <div className="mx-auto mb-6 w-fit rounded-3xl bg-gradient-to-br from-green-500 to-teal-500 p-5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-green-600">
              Interview Prep
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Practice with AI-powered questions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Resumes */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="rounded-xl bg-primary/10 p-2">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                Recent Resumes
              </CardTitle>
              <CardDescription className="mt-2">
                Your latest resume projects and their performance
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/resumes')}
              className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentResumes.map((resume) => (
              <div
                key={resume.id}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-gradient-to-r from-muted/50 to-muted/30 p-5 transition-all duration-300 hover:border-border/50 hover:from-muted hover:to-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 transition-all duration-300 group-hover:from-primary/30 group-hover:to-accent/30">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-foreground transition-colors group-hover:text-primary">
                      {resume.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {resume.template} • {resume.lastEdited}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="mb-1 text-sm text-muted-foreground">
                      ATS Score
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        resume.score >= 90
                          ? 'text-green-600'
                          : resume.score >= 80
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {resume.score}%
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/builder/${resume.id}`)}
                    className="transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
