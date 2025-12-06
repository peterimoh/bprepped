'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  CheckCircle,
  FileText,
  MessageSquare,
  Scan,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const navigate = useRouter();

  const features = [
    {
      icon: FileText,
      title: 'ATS-Optimized Builder',
      description:
        'Create professional resumes that pass Applicant Tracking Systems with our smart templates.',
      color: 'from-blue-500 to-cyan-500',
      bgLight: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Scan,
      title: 'Smart Resume Scanner',
      description:
        'Match your resume with job descriptions and get AI-powered improvement suggestions.',
      color: 'from-purple-500 to-pink-500',
      bgLight: 'from-purple-50 to-pink-50',
    },
    {
      icon: MessageSquare,
      title: 'AI Interview Coach',
      description:
        'Practice with personalized interview questions tailored to your target role.',
      color: 'from-green-500 to-teal-500',
      bgLight: 'from-green-50 to-teal-50',
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description:
        'Automatically enhance your resume to match specific job requirements.',
      color: 'from-amber-500 to-orange-500',
      bgLight: 'from-amber-50 to-orange-50',
    },
  ];

  const benefits = [
    'Pass ATS filters with confidence',
    'Unlimited premium templates',
    'AI-powered optimization',
    'Personalized interview prep',
    'Professional PDF export',
    'Real-time resume scoring',
  ];

  const stats = [
    { value: '50K+', label: 'Resumes Created', icon: FileText },
    { value: '95%', label: 'ATS Success Rate', icon: TrendingUp },
    { value: '4.9/5', label: 'User Rating', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => navigate.push('/')}
          >
            <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-2.5 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
              ResumeAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate.push('/auth')}
              className="hidden transition-all duration-300 hover:bg-primary/10 sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate.push('/auth')}
              className="border-0 bg-gradient-to-r from-primary to-accent text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-accent/90 hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl"></div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Resume Builder
              </span>
            </div>
            <h1 className="text-balance mb-8 text-6xl font-bold leading-tight md:text-8xl">
              Build{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ATS-Ready
              </span>{' '}
              Resumes That Get You Hired
            </h1>
            <p className="text-balance mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Create, optimize, and perfect your resume with AI-powered tools
              designed for modern job seekers
            </p>
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="border-0 bg-gradient-to-r from-primary to-accent px-10 py-6 text-lg text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-accent/90 hover:shadow-2xl"
                onClick={() => navigate.push('/auth')}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-1 bg-white px-10 py-6 text-lg transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate.push('/auth')}
              >
                View Templates
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 text-sm text-muted-foreground sm:flex-row">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Free first analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Secure & private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-b border-border/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <CardContent className="relative pb-8 pt-10 text-center">
                  <div className="mx-auto mb-4 w-fit rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 transition-transform duration-300 group-hover:scale-110">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold text-transparent">
                    {stat.value}
                  </div>
                  <p className="font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-gradient-to-r from-accent/10 to-primary/10 px-4 py-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                Powerful Features
              </span>
            </div>
            <h2 className="text-balance mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Everything You Need to Land
              <br />
              Your{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Dream Job
              </span>
            </h2>
            <p className="text-balance mx-auto max-w-2xl text-xl text-muted-foreground">
              Powerful features designed to give you a competitive edge in your
              job search
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden border-0 bg-gradient-to-br shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.bgLight}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                ></div>
                <CardContent className="pb-6 pt-8">
                  <div
                    className={`w-fit rounded-2xl bg-gradient-to-br p-4 ${feature.color} mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-muted/30 to-muted/10 py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-success/20 bg-gradient-to-r from-success/10 to-primary/10 px-4 py-2">
                <Target className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">
                  Why Choose ResumeAI
                </span>
              </div>
              <h2 className="text-balance mb-6 text-5xl font-bold leading-tight md:text-6xl">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ResumeAI
                </span>
                ?
              </h2>
              <p className="text-balance mb-10 text-xl leading-relaxed text-muted-foreground">
                Join thousands of job seekers who have successfully landed
                interviews using our platform
              </p>
              <div className="mb-10 space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div className="rounded-xl bg-gradient-to-br from-success/20 to-primary/20 p-2 transition-transform duration-300 group-hover:scale-110">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-success" />
                    </div>
                    <span className="text-lg font-medium text-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                className="border-0 bg-gradient-to-r from-primary to-accent text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-accent/90 hover:shadow-2xl"
                onClick={() => navigate.push('/auth')}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border/20 bg-gradient-to-br from-primary/10 to-accent/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                <FileText className="h-48 w-48 text-primary/30" />
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-success/20 to-primary/20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Star className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-balance mb-8 text-5xl font-bold leading-tight text-white md:text-6xl">
              Ready to Transform Your
              <br />
              Job Search?
            </h2>
            <p className="text-balance mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-white/90">
              Start building your professional resume today. First resume
              analysis is completely free!
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="hover:shadow-3xl bg-white px-12 py-7 text-lg text-primary shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              onClick={() => navigate.push('/auth')}
            >
              Create Your Resume Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-2">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ResumeAI</span>
          </div>
          <p className="text-muted-foreground">
            &copy; 2024 ResumeAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
