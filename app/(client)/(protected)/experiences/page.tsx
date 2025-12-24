'use client';
import { Fragment, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/use-pagination';
import {
  useGetExperiences,
  ExperiencesError,
  useDeleteExperience,
  UserExperience,
} from '@/lib/api-hooks/experiences';
import { EmptyRecordCard } from '@/components/ui/empty-record-card';
import {
  CreateAndEditExperience,
  CreateResumeDialog,
  ExperienceCard,
} from './components';
import { Spinner } from '@/components/ui/spinner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ActionType = 'create' | 'edit';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    preview: 'Clean and contemporary',
  },
  {
    id: 'classic',
    name: 'Classic ATS',
    preview: 'Traditional and ATS-optimized',
  },
  { id: 'creative', name: 'Creative Edge', preview: 'Stand out with style' },
];

export default function Experiences() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { currentPage, handlePageChange, generatePageNumbers } = usePagination({
    initialPage: 1,
  });

  const {
    data: _experiences,
    isLoading,
    isError,
    error,
  } = useGetExperiences({
    page: currentPage,
    limit: 15,
  });

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [experienceToEdit, setExperienceToEdit] =
    useState<UserExperience | null>(null);
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isCreateResumeOpen, setIsCreateResumeOpen] = useState(false);

  const handleAddExperience = () => {
    setIsAddingExperience(true);
    setExperienceToEdit(null);
    setActionType('create');
  };

  const handleEditExperience = (experience: UserExperience) => {
    setIsAddingExperience(false);
    setExperienceToEdit(experience);
    setActionType('edit');
  };

  const handleCancelEdit = () => {
    setIsAddingExperience(false);
    setExperienceToEdit(null);
    setActionType(null);
  };

  const deleteExperienceMutation = useDeleteExperience();

  const handleDeleteExperience = (id: number) => {
    deleteExperienceMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Experience deleted',
          description: 'The work experience has been removed.',
        });
        queryClient.invalidateQueries({ queryKey: ['experiences'] });
      },
      onError: (error: ExperiencesError) => {
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete experience',
          variant: 'destructive',
        });
      },
    });
  };

  const handleExperienceSelection = (
    experienceId: number,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedExperiences((prev) => [...prev, experienceId]);
    } else {
      setSelectedExperiences((prev) =>
        prev.filter((id) => id !== experienceId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && _experiences) {
      setSelectedExperiences(_experiences.data.map((exp) => exp.id));
    } else {
      setSelectedExperiences([]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Work Experience
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your professional work history
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-1 bg-white"
            onClick={() => setIsCreateResumeOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Resume from Experiences
          </Button>

          <Button onClick={handleAddExperience}>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </div>

      <CreateResumeDialog
        open={isCreateResumeOpen}
        onOpenChange={setIsCreateResumeOpen}
        experiences={_experiences?.data || []}
        templates={templates}
        handleCreateResume={() => {
          toast({
            title: 'Resume created successfully',
            description: `Created resume using ${selectedTemplate} template with ${selectedExperiences.length} experience(s)`,
          });
          setIsCreateResumeOpen(false);
        }}
        selectedExperiences={selectedExperiences}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        onSelectAll={handleSelectAll}
        handleExperienceSelection={handleExperienceSelection}
        isLoading={isLoading}
      />

      {(isAddingExperience || experienceToEdit) && actionType && (
        <CreateAndEditExperience
          actionType={actionType}
          onCancel={handleCancelEdit}
          experience={experienceToEdit ?? undefined}
        />
      )}

      {isLoading && <Spinner loadingText={null} className="py-6" />}

      {isError && (
        <Alert
          variant={'destructive'}
          className={'border-transparent bg-red-200 py-3 text-sm text-red-500'}
        >
          <AlertDescription className={'capitalize'}>
            Error: {error.error}
          </AlertDescription>
        </Alert>
      )}

      {_experiences && (
        <Fragment>
          <div className="space-y-6">
            {_experiences.data.map((experience) => (
              <ExperienceCard
                key={experience.id}
                onEdit={() => handleEditExperience(experience)}
                onDelete={() => handleDeleteExperience(experience.id)}
                experience={experience}
              />
            ))}
          </div>

          {_experiences.data.length === 0 && !isAddingExperience && (
            <EmptyRecordCard
              title={'No work experience yet'}
              description={
                'Start building your professional profile by adding your first work experience.'
              }
              buttonLabel={'Add Your First Experience'}
              onClick={handleAddExperience}
            />
          )}

          {/* Pagination */}
          {_experiences.pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        _experiences.pagination.hasPreviousPage &&
                        handlePageChange(currentPage - 1)
                      }
                      className={
                        !_experiences.pagination.hasPreviousPage
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {generatePageNumbers(
                    _experiences.pagination.page,
                    _experiences.pagination.totalPages
                  ).map((page, index) =>
                    page === -1 ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className={`cursor-pointer ${
                            page === currentPage
                              ? 'bg-primary text-white shadow-sm hover:bg-primary/70'
                              : 'hover:border-1 hover:bg-white'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        _experiences.pagination.hasNextPage &&
                        handlePageChange(currentPage + 1)
                      }
                      className={
                        !_experiences.pagination.hasNextPage
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}
