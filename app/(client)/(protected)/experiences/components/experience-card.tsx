import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Award,
  Briefcase,
  Building,
  Calendar,
  Code,
  Edit,
  MapPin,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserExperience } from '@/lib/api-hooks/experiences';
import { format } from 'date-fns';

const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'MMMM yyyy');
};

export interface ExperienceCardProps {
  experience: UserExperience;
  onEdit: (row: object) => void;
  onDelete: (id: number) => void;
}

const listStyles = `
  .list-container ul {
    list-style: disc;
    margin-left: 0.75rem;
    space-y: 0.25rem;
  }

  .list-container li {
    margin-bottom: 0.25rem;
    display: list-item;
  }

  .list-container li p {
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    line-height: 1.5rem;
  }

  .list-primary ul::marker {
    color: hsl(var(--primary));
  }

  .list-primary ul {
    color: hsl(var(--primary));
  }

  .list-success ul::marker {
    color: hsl(var(--success));
  }

  .list-success ul {
    color: hsl(var(--success));
  }
`;

const formatListContent = (content: string): string => {
  if (content.includes('<ul') || content.includes('<ol')) {
    return content;
  }

  return `<ul>${content.replace(/<p>/g, '<li><p>').replace(/<\/p>/g, '</p></li>')}</ul>`;
};

export function ExperienceCard({
  experience,
  onDelete,
  onEdit,
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function renderEndDate() {
    if (!experience.endDate && experience.isCurrent) {
      return 'Present';
    }
    return formatDate(experience.endDate as Date);
  }

  const DESCRIPTION_MAX_LENGTH = 150;
  const shouldTruncate = Boolean(
    experience.description &&
    experience.description.length > DESCRIPTION_MAX_LENGTH
  );
  const displayDescription =
    shouldTruncate && !isExpanded
      ? (experience.description || '').slice(0, DESCRIPTION_MAX_LENGTH) + '...'
      : experience.description || '';

  return (
    <>
      <style>{listStyles}</style>
      <Card className="border shadow-card transition-all duration-300 hover:shadow-lg">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  {experience.company}
                </h3>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold text-foreground">
                  {experience.position}
                </span>
              </div>
              <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(experience.startDate as Date)} -{' '}
                    {renderEndDate()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(experience)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(experience.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {experience.description && (
            <div className="mb-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                {displayDescription}{' '}
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-1 text-primary hover:underline focus:outline-none"
                  >
                    {isExpanded ? 'See less' : 'Read more'}
                  </button>
                )}
              </p>
            </div>
          )}

          {experience.technologies && experience?.technologies.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Technologies
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="border-primary/20 bg-primary/10 capitalize text-primary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {experience.responsibilities &&
              experience.responsibilities.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Responsibilities
                    </span>
                  </div>
                  <div
                    className="list-container list-primary"
                    dangerouslySetInnerHTML={{
                      __html: formatListContent(experience.responsibilities),
                    }}
                  />
                </div>
              )}

            {experience.achievements && experience.achievements.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Key Achievements
                  </span>
                </div>
                <div
                  className="list-container list-success"
                  dangerouslySetInnerHTML={{
                    __html: formatListContent(experience.achievements),
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
