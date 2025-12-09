'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Layout,
  Upload,
  Eye,
  Download,
  Plus,
  FileText,
  Palette,
  Settings,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TemplateExtractor from '@/components/template-extractor';
import { Path } from '@/lib/path';

interface Template {
  id: string;
  name: string;
  type: 'built-in' | 'extracted' | 'custom';
  description: string;
  sections: number;
  layout: string;
  preview?: string;
}

export default function Templates() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('built-in');

  const builtInTemplates: Template[] = [
    {
      id: 'modern',
      name: 'Modern Professional',
      type: 'built-in',
      description: 'Clean and contemporary design perfect for tech roles',
      sections: 6,
      layout: 'single-column',
      preview: 'modern',
    },
    {
      id: 'classic',
      name: 'Classic ATS',
      type: 'built-in',
      description:
        'Traditional format optimized for applicant tracking systems',
      sections: 5,
      layout: 'single-column',
      preview: 'classic',
    },
    {
      id: 'creative',
      name: 'Creative Edge',
      type: 'built-in',
      description: 'Stand out with modern design elements',
      sections: 7,
      layout: 'two-column',
      preview: 'creative',
    },
  ];

  const [extractedTemplates, setExtractedTemplates] = useState<Template[]>([]);

  const handleUseTemplate = (template: Template) => {
    // Store selected template for resume builder
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));

    toast({
      title: 'Template selected!',
      description: `${template.name} will be used in resume builder.`,
    });

    // Navigate to resume builder
    window.location.href = Path.Client.Protected.Builder;
  };

  const handleDeleteTemplate = (templateId: string) => {
    setExtractedTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast({
      title: 'Template deleted',
      description: 'The template has been removed from your collection.',
    });
  };

  const handleExportTemplate = (template: Template) => {
    toast({
      title: 'Export started',
      description: 'Template is being exported...',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Template Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage and create resume templates
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Template
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="built-in" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Built-in Templates
          </TabsTrigger>
          <TabsTrigger value="extracted" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Extracted Templates
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="built-in" className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Built-in Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {builtInTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <CardContent className="pt-6">
                      <div className="mb-4 flex aspect-[8.5/11] items-center justify-center rounded-xl border-2 border-border/30 bg-gradient-to-br from-muted/30 to-muted/10 transition-colors group-hover:border-primary/30">
                        <FileText className="h-16 w-16 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                            {template.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.layout}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.sections} sections
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Use
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportTemplate(template)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extracted" className="space-y-6">
          <TemplateExtractor />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Create Custom Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <Settings className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Custom Template Builder
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create your own template with our visual editor. Coming soon!
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Get Notified When Available
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
