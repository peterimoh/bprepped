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

export interface ExperienceCardProps {
  id: number;
  company: string;
  position: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  onEdit: (row: object) => void;
  onDelete: (id: number) => void;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
}

export function ExperienceCard(experience: ExperienceCardProps) {
  return (
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
                  {experience.startDate} - {experience.endDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => experience.onEdit(experience)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => experience.onDelete(experience.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {experience.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {experience.description}
          </p>
        )}

        {experience.technologies.length > 0 && (
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
                  className="border-primary/20 bg-primary/10 text-primary"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {experience.responsibilities.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Responsibilities
                </span>
              </div>
              <ul className="space-y-1">
                {experience.responsibilities.map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 text-primary">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experience.achievements.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Key Achievements
                </span>
              </div>
              <ul className="space-y-1">
                {experience.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 text-success">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
