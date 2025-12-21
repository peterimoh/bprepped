import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyRecordCardProps {
  onClick?: () => void;
  buttonLabel?: string;
  title: string;
  description?: string;
  sectionIcon?: React.ComponentType<{ className?: string }>;
  buttonIcon?: React.ComponentType<{ className?: string }>;
}

export function EmptyRecordCard({
  onClick,
  buttonLabel,
  title,
  description,
  sectionIcon: SectionIcon = Briefcase,
  buttonIcon: ButtonIcon = Plus,
}: EmptyRecordCardProps) {
  return (
    <Card className="border shadow-card">
      <CardContent className="pb-20 pt-20 text-center">
        <SectionIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
        <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mb-6 text-muted-foreground">{description}</p>
        )}
        {onClick && (
          <Button onClick={onClick}>
            <ButtonIcon className="mr-2 h-4 w-4" />
            {buttonLabel || 'Add New'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
