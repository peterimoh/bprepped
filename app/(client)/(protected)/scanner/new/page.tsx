'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Scan,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Path } from '@/lib/path';

export default function NewScan() {
  const { toast } = useToast();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleScan = () => {
    if (!jobTitle || !jobDescription) {
      toast({
        title: 'Missing information',
        description: 'Please provide both job title and description.',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);
    // Simulate AI scanning
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      toast({
        title: 'Scan complete!',
        description: '10 tokens used for this analysis.',
      });
    }, 3000);
  };

  const handleOptimize = () => {
    toast({
      title: 'Optimization started',
      description: 'Your resume is being optimized for this job...',
    });
  };

  const handleBackToHistory = () => {
    router.push(Path.Client.Protected.Scanner.Root);
  };

  const scanResults = {
    id: Date.now(),
    resumeName: 'Current Resume',
    jobTitle: jobTitle,
    company: 'Current Company',
    score: 68,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    issues: [
      {
        type: 'error',
        text: "Missing keyword: 'React' appears 5 times in job description but 0 times in resume",
      },
      {
        type: 'warning',
        text: 'Skills section could be more prominent for ATS scanning',
      },
      { type: 'error', text: "No mention of 'agile' or 'scrum' methodologies" },
    ],
    suggestions: [
      "Add 'React.js development' to your skills section",
      "Mention specific agile practices you've used",
      'Increase font size of skills section for better ATS parsing',
      'Add more quantifiable achievements',
    ],
    keywords: { matched: 12, missing: 5, total: 17 },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBackToHistory}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            New Resume Scan
          </h1>
          <p className="text-xl text-muted-foreground">
            Analyze your resume against job requirements
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
                <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
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
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Scan className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-5 w-5" />
                Scan Resume (10 tokens)
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {scanComplete ? (
            <>
              <Card className="border bg-primary/5 shadow-card">
                <CardHeader>
                  <CardTitle>Match Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mb-2 text-6xl font-bold text-primary">
                        {scanResults.score}%
                      </div>
                      <p className="text-muted-foreground">Resume-Job Match</p>
                    </div>
                    <Progress value={scanResults.score} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-success">
                          {scanResults.keywords.matched}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Keywords Match
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-warning">
                          {scanResults.keywords.missing}
                        </p>
                        <p className="text-sm text-muted-foreground">Missing</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {scanResults.issues.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issues Found
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-card">
                <CardHeader>
                  <CardTitle>Issues Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scanResults.issues.map((issue: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg bg-muted/30 p-3"
                      >
                        <AlertCircle
                          className={`h-5 w-5 flex-shrink-0 ${
                            issue.type === 'error'
                              ? 'text-destructive'
                              : 'text-warning'
                          }`}
                        />
                        <p className="text-sm text-foreground">{issue.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-card">
                <CardHeader>
                  <CardTitle>Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {scanResults.suggestions.map(
                      (suggestion: string, index: number) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-success/20 bg-success/5 p-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                          <p className="text-sm text-foreground">
                            {suggestion}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg" onClick={handleOptimize}>
                <Sparkles className="mr-2 h-5 w-5" />
                Auto-Optimize Resume (15 tokens)
              </Button>
            </>
          ) : (
            <Card className="border shadow-card">
              <CardContent className="pb-20 pt-20 text-center">
                <Scan className="mx-auto mb-4 h-20 w-20 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">
                  Upload a resume and add job details to start scanning
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
