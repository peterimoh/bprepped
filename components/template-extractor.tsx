import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  Eye,
  Save,
  Trash2,
  Plus,
  Move,
  Type,
  Layout,
  Palette,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractedSection {
  id: string;
  name: string;
  content: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'custom';
  order: number;
  styling: {
    fontSize: number;
    fontWeight: string;
    alignment: string;
    spacing: number;
  };
}

interface TemplateData {
  id: string;
  name: string;
  description: string;
  sections: ExtractedSection[];
  layout: 'single-column' | 'two-column' | 'modern' | 'creative';
  styling: {
    fontFamily: string;
    primaryColor: string;
    fontSize: number;
    lineHeight: number;
  };
}

const TemplateExtractor = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedTemplate, setExtractedTemplate] =
    useState<TemplateData | null>(null);
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';
      const sections: ExtractedSection[] = [];

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      // Analyze and extract sections based on common patterns
      const extractedSections = analyzeResumeSections(fullText);

      const template: TemplateData = {
        id: Date.now().toString(),
        name: file.name.replace('.pdf', ''),
        description: `Extracted from ${file.name}`,
        sections: extractedSections,
        layout: detectLayout(fullText),
        styling: {
          fontFamily: 'Inter',
          primaryColor: '#1f2937',
          fontSize: 12,
          lineHeight: 1.5,
        },
      };

      setExtractedTemplate(template);
      toast({
        title: 'Template extracted successfully!',
        description: `Found ${extractedSections.length} sections in your resume.`,
      });
    } catch (error) {
      console.error('PDF extraction error:', error);
      toast({
        title: 'Extraction failed',
        description:
          'Could not extract template from PDF. Please try a different file.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const analyzeResumeSections = (text: string): ExtractedSection[] => {
    const sections: ExtractedSection[] = [];
    const lines = text.split('\n').filter((line) => line.trim());

    // Common section headers in resumes
    const sectionPatterns = {
      header: /^(name|contact|email|phone|address)$/i,
      summary: /^(summary|objective|profile|about)$/i,
      experience: /^(experience|work|employment|career|professional)$/i,
      education: /^(education|academic|qualification|degree)$/i,
      skills: /^(skills|technical|competencies|abilities)$/i,
    };

    let currentSection: ExtractedSection | null = null;
    let sectionOrder = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Check if this line is a section header
      for (const [type, pattern] of Object.entries(sectionPatterns)) {
        if (pattern.test(trimmedLine)) {
          // Save previous section if exists
          if (currentSection) {
            sections.push(currentSection);
          }

          // Start new section
          currentSection = {
            id: `section-${sectionOrder}`,
            name: trimmedLine,
            content: '',
            type: type as ExtractedSection['type'],
            order: sectionOrder++,
            styling: {
              fontSize: detectFontSize(trimmedLine),
              fontWeight: detectFontWeight(trimmedLine),
              alignment: detectAlignment(trimmedLine),
              spacing: 12,
            },
          };
          return;
        }
      }

      // Add content to current section
      if (currentSection && trimmedLine) {
        currentSection.content += trimmedLine + ' ';
      }
    });

    // Add last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const detectLayout = (text: string): TemplateData['layout'] => {
    // Simple heuristics to detect layout
    const hasColumns = text.includes('|') || text.includes('•');
    const hasModernElements =
      text.includes('LinkedIn') || text.includes('GitHub');

    if (hasModernElements) return 'modern';
    if (hasColumns) return 'two-column';
    return 'single-column';
  };

  const detectFontSize = (text: string): number => {
    // Simple heuristic based on text characteristics
    if (text.length < 20 && text === text.toUpperCase()) return 16;
    if (text.length < 50) return 14;
    return 12;
  };

  const detectFontWeight = (text: string): string => {
    if (text === text.toUpperCase()) return 'bold';
    return 'normal';
  };

  const detectAlignment = (text: string): string => {
    if (text.includes(':')) return 'left';
    return 'left';
  };

  const handleSaveTemplate = () => {
    if (!extractedTemplate) return;

    setTemplates((prev) => [...prev, extractedTemplate]);
    setExtractedTemplate(null);

    toast({
      title: 'Template saved!',
      description: 'Your template has been added to the collection.',
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast({
      title: 'Template deleted',
      description: 'The template has been removed from your collection.',
    });
  };

  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<ExtractedSection>
  ) => {
    if (!extractedTemplate) return;

    setExtractedTemplate((prev) => ({
      ...prev!,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card className="border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Extract Template from PDF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-border/50 p-8 text-center transition-colors hover:border-primary/50">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />

            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Upload Your PDF Resume Template
            </h3>
            <p className="mb-6 text-muted-foreground">
              Upload an ATS-standard PDF resume to extract its structure and
              create a reusable template.
            </p>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="mx-auto"
            >
              {isExtracting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Extracting Template...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose PDF File
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Template Preview */}
      {extractedTemplate && (
        <Card className="border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Extracted Template: {extractedTemplate.name}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setExtractedTemplate(null)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Template Info */}
              <div className="space-y-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={extractedTemplate.name}
                    onChange={(e) =>
                      setExtractedTemplate((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={extractedTemplate.description}
                    onChange={(e) =>
                      setExtractedTemplate((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Layout Type</Label>
                  <Select
                    value={extractedTemplate.layout}
                    onValueChange={(value) =>
                      setExtractedTemplate((prev) =>
                        prev
                          ? { ...prev, layout: value as TemplateData['layout'] }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-column">
                        Single Column
                      </SelectItem>
                      <SelectItem value="two-column">Two Column</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <Label>Extracted Sections</Label>
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {extractedTemplate.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selectedSection === section.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {section.type}
                          </Badge>
                          <span className="text-sm font-medium">
                            {section.name}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Move className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Editor */}
            {selectedSection && (
              <div className="mt-6 border-t pt-6">
                <h4 className="mb-4 flex items-center gap-2 font-semibold">
                  <Type className="h-4 w-4" />
                  Edit Section
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Section Name</Label>
                    <Input
                      value={
                        extractedTemplate.sections.find(
                          (s) => s.id === selectedSection
                        )?.name || ''
                      }
                      onChange={(e) =>
                        handleUpdateSection(selectedSection, {
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Section Type</Label>
                    <Select
                      value={
                        extractedTemplate.sections.find(
                          (s) => s.id === selectedSection
                        )?.type || 'custom'
                      }
                      onValueChange={(value) =>
                        handleUpdateSection(selectedSection, {
                          type: value as ExtractedSection['type'],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="experience">Experience</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="skills">Skills</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Content Preview</Label>
                    <Textarea
                      value={
                        extractedTemplate.sections.find(
                          (s) => s.id === selectedSection
                        )?.content || ''
                      }
                      onChange={(e) =>
                        handleUpdateSection(selectedSection, {
                          content: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Saved Templates */}
      {templates.length > 0 && (
        <Card className="border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Your Extracted Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="border transition-shadow hover:shadow-md"
                >
                  <CardContent className="pt-4">
                    <div className="mb-3 flex aspect-[8.5/11] items-center justify-center rounded-lg bg-muted/30">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h4 className="mb-1 font-semibold text-foreground">
                      {template.name}
                    </h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {template.sections.length} sections
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateExtractor;
