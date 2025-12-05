'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download, Edit, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Resumes() {
  const router = useRouter();

  const resumes = [
    {
      id: 1,
      title: 'Software Engineer Resume',
      template: 'Modern Professional',
      lastEdited: '2 hours ago',
      score: 85,
    },
    {
      id: 2,
      title: 'Product Manager CV',
      template: 'Classic ATS',
      lastEdited: '1 day ago',
      score: 92,
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      template: 'Creative Edge',
      lastEdited: '3 days ago',
      score: 78,
    },
    {
      id: 4,
      title: 'Data Analyst Resume',
      template: 'Modern Professional',
      lastEdited: '1 week ago',
      score: 88,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-5xl font-bold text-foreground">
            My Resumes
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your resume collection
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push('/builder')}
          className="shadow-md"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            className="group border shadow-lg transition-shadow hover:shadow-xl"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative flex aspect-[8.5/11] items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted/30">
                  <FileText className="relative h-20 w-20 text-primary opacity-10" />
                </div>

                <div>
                  <h3 className="mb-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {resume.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {resume.template}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Edited {resume.lastEdited}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    ATS Score
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    {resume.score}%
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/builder/${resume.id}`)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
