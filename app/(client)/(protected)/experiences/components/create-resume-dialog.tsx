import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Briefcase,
  Building,
  Calendar,
  FileText,
  MapPin,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserExperience } from '@/lib/api-hooks/experiences';
import { format, parseISO } from 'date-fns';

interface Template {
  id: string;
  name: string;
  preview: string;
}

export interface CreateResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experiences: UserExperience[];
  templates: Template[];
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
  selectedExperiences: number[];
  handleCreateResume: () => void;
  onSelectAll: (checked: boolean) => void;
  handleExperienceSelection: (experienceId: number, checked: boolean) => void;
  isLoading?: boolean;
}

export function CreateResumeDialog({
  open,
  onOpenChange,
  experiences,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  selectedExperiences,
  handleCreateResume,
  onSelectAll,
  handleExperienceSelection,
  isLoading = false,
}: CreateResumeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create Resume from Experiences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Choose Template</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer border transition-all ${
                    selectedTemplate === template.id
                      ? 'shadow-lg ring-2 ring-primary'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="pt-6">
                    <div className="mb-3 flex aspect-[8.5/11] items-center justify-center rounded bg-muted/30">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">
                      {template.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {template.preview}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Experience Selection */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Select Experiences to Include
              </h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="selectAll"
                  checked={
                    selectedExperiences.length === experiences.length &&
                    experiences.length > 0
                  }
                  onCheckedChange={onSelectAll}
                />
                <Label htmlFor="selectAll" className="text-sm">
                  Select All
                </Label>
              </div>
            </div>

            <div className="max-h-60 space-y-3 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  Loading experiences...
                </div>
              ) : experiences.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Briefcase className="mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="mb-1 font-medium text-foreground">
                    No experiences available
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add some work experiences first to create a resume
                  </p>
                </div>
              ) : (
                experiences.map((experience) => (
                  <Card key={experience.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`exp-${experience.id}`}
                        checked={selectedExperiences.includes(experience.id)}
                        onCheckedChange={(checked) =>
                          handleExperienceSelection(
                            experience.id,
                            checked as boolean
                          )
                        }
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`exp-${experience.id}`}
                          className="cursor-pointer"
                        >
                          <div className="mb-2 flex items-center gap-3">
                            <Building className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-foreground">
                              {experience.company}
                            </h4>
                          </div>
                          <div className="mb-2 flex items-center gap-2">
                            <Briefcase className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {experience.position}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{experience.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {experience.startDate
                                  ? format(
                                      parseISO(String(experience.startDate)),
                                      'MMMM yyyy'
                                    )
                                  : 'Present'}
                                {' - '}
                                {experience.endDate
                                  ? format(
                                      parseISO(String(experience.endDate)),
                                      'MMMM yyyy'
                                    )
                                  : 'Present'}
                              </span>
                            </div>
                          </div>
                          {experience.technologies &&
                            experience.technologies.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {experience.technologies
                                  .slice(0, 3)
                                  .map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs capitalize"
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                {experience.technologies.length > 3 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs capitalize"
                                  >
                                    +{experience.technologies.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                        </Label>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateResume}
              disabled={
                isLoading ||
                experiences.length === 0 ||
                selectedExperiences.length === 0
              }
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Create Resume ({selectedExperiences.length} selected)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
