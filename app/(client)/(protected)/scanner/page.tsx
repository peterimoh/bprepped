'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Scan,
  Clock,
  FileText,
  ChevronRight,
  Trash2,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Path } from '@/lib/path';

export default function Scanner() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(true);

  // Mock scan history data
  const scanHistory = [
    {
      id: 1,
      resumeName: 'Software Engineer Resume',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp',
      score: 85,
      date: '2024-01-15',
      time: '2:30 PM',
      issues: [
        {
          type: 'error',
          text: "Missing keyword: 'React' appears 5 times in job description but 0 times in resume",
        },
        {
          type: 'warning',
          text: 'Skills section could be more prominent for ATS scanning',
        },
      ],
      suggestions: [
        "Add 'React.js development' to your skills section",
        "Mention specific agile practices you've used",
        'Increase font size of skills section for better ATS parsing',
      ],
      keywords: { matched: 12, missing: 5, total: 17 },
    },
    {
      id: 2,
      resumeName: 'Product Manager CV',
      jobTitle: 'Senior Product Manager',
      company: 'StartupXYZ',
      score: 92,
      date: '2024-01-14',
      time: '10:15 AM',
      issues: [
        {
          type: 'warning',
          text: 'Consider adding more quantifiable achievements',
        },
      ],
      suggestions: [
        'Add specific metrics for product launches',
        'Include team size and scope of projects',
        'Mention revenue impact where possible',
      ],
      keywords: { matched: 15, missing: 3, total: 18 },
    },
    {
      id: 3,
      resumeName: 'Marketing Specialist',
      jobTitle: 'Digital Marketing Manager',
      company: 'MarketingPro',
      score: 78,
      date: '2024-01-13',
      time: '4:45 PM',
      issues: [
        { type: 'error', text: "No mention of 'SEO' or 'SEM' strategies" },
        { type: 'error', text: 'Missing analytics tools experience' },
        { type: 'warning', text: 'Campaign results could be more specific' },
      ],
      suggestions: [
        'Add experience with Google Analytics and SEO tools',
        'Include specific campaign performance metrics',
        'Mention A/B testing and conversion optimization',
      ],
      keywords: { matched: 10, missing: 7, total: 17 },
    },
  ];

  const handleViewScan = (scan: any) => {
    setSelectedScan(scan);
    setShowHistory(false);
  };

  const handleDeleteScan = (scanId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Scan deleted',
      description: 'The scan has been removed from your history.',
    });
  };

  const handleBackToHistory = () => {
    setSelectedScan(null);
    setShowHistory(true);
  };

  const handleNewScan = () => {
    router.push(Path.Client.Protected.Scanner.New);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Resume Scanner
          </h1>
          <p className="text-xl text-muted-foreground">
            View your scan history and results
          </p>
        </div>
        <Button onClick={handleNewScan}>
          <Plus className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      {/* Scan History */}
      {showHistory && (
        <Card className="border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scan History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanHistory.length > 0 ? (
              <div className="space-y-3">
                {scanHistory.map((scan) => (
                  <div
                    key={scan.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    onClick={() => handleViewScan(scan)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {scan.resumeName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {scan.jobTitle} at {scan.company} • {scan.date} at{' '}
                          {scan.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${
                            scan.score >= 90
                              ? 'text-green-600'
                              : scan.score >= 80
                                ? 'text-amber-600'
                                : 'text-red-600'
                          }`}
                        >
                          {scan.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Match Score
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteScan(scan.id, e)}
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
                <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mb-4 text-muted-foreground">
                  No scan history yet. Start your first scan!
                </p>
                <Button onClick={handleNewScan}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Your First Scan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scan Details */}
      {!showHistory && selectedScan && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Scan Info */}
          <div className="space-y-6">
            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Scan Details
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
                      {selectedScan.resumeName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedScan.jobTitle} at {selectedScan.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedScan.date} at {selectedScan.time}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/30 p-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-success">
                        {selectedScan.keywords.matched}
                      </p>
                      <p className="text-xs text-muted-foreground">Matched</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">
                        {selectedScan.keywords.missing}
                      </p>
                      <p className="text-xs text-muted-foreground">Missing</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {selectedScan.keywords.total}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
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
                  {selectedScan.issues.map((issue: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-lg bg-muted/30 p-3"
                    >
                      <Scan
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
          </div>

          {/* Suggestions */}
          <div className="space-y-6">
            <Card className="border bg-primary/5 shadow-card">
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div className="text-6xl font-bold text-primary">
                    {selectedScan.score}%
                  </div>
                  <p className="text-muted-foreground">Resume-Job Match</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-card">
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedScan.suggestions.map(
                    (suggestion: string, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg border border-success/20 bg-success/5 p-3"
                      >
                        <Scan className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                        <p className="text-sm text-foreground">{suggestion}</p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push(Path.Client.Protected.Scanner.New)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
