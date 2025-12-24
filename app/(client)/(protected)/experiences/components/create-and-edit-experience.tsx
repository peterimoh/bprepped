import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Control, type UseFormReturn } from 'react-hook-form';
import { Award, Briefcase, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TagInput, type Tag } from 'tagmento';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import {
  CreateExperienceData,
  useCreateUserExperience,
  UserExperience,
  useUpdateExperience,
} from '@/lib/api-hooks/experiences';
import { toast } from '@/hooks/use-toast';
import { Editor } from '@/components/ui/editor/editor';
import { useQueryClient } from '@tanstack/react-query';
import { format, isValid, parseISO } from 'date-fns';

const ValidationSchema = z
  .object({
    company: z.string().min(3, 'Company name is required'),
    position: z.string().min(3, 'Position is required'),
    location: z.string().min(3, 'Location is required'),
    startDate: z.string().min(1, 'Start Date is required'),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.string().min(3, 'Description is required'),
    technologies: z.string(),
    achievements: z.string().min(3, 'Achievements is required'),
    responsibilities: z.string().min(3, 'Responsibilities is required'),
    employment_type: z
      .string({ message: 'Employment Type is required' })
      .min(3, 'Employment Type is required'),
  })
  .refine(
    (data) => {
      if (!data.current) {
        if (!data.endDate) {
          return false;
        }
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

type FormData = z.infer<typeof ValidationSchema>;

interface CreateAndEditExperienceProps {
  actionType: 'create' | 'edit' | null;
  experience?: UserExperience;
  onCancel: () => void;
}

const employmentTypes = [
  'Full-Time',
  'Part-Time',
  'Self-employed',
  'Freelance',
  'Contract',
  'Internship',
  'Apprenticeship',
  'Seasonal',
];

function _technologies(technologies: Array<string>): Tag[] {
  if (!technologies || !technologies.length) return [];

  return technologies.map((technology) => ({
    id: technology,
    text: technology,
  }));
}

function transformToArray(input: string | string[]): string[] {
  if (Array.isArray(input)) return input;
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateForMonthInput(
  date: string | Date | null | undefined
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'yyyy-MM');
}

function transformToApiData(data: FormData): CreateExperienceData {
  return {
    company: data.company,
    position: data.position,
    location: data.location,
    employment_type: data.employment_type,
    start_date: data.startDate,
    end_date: data.endDate,
    is_current: data.current.toString(),
    description: data.description,
    technologies: transformToArray(data.technologies),
    achievements: data.achievements,
    responsibilities: data.responsibilities,
  };
}

function EditorField({
  form,
  name,
  label,
}: {
  form: UseFormReturn<FormData>;
  name: 'achievements' | 'responsibilities';
  label: string;
}) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Editor
              onChange={(value) => form.setValue(name, value)}
              options={['bulletList']}
              content={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function InputField({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<FormData>;
  name: 'company' | 'position' | 'location';
  label: string;
  placeholder: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DateField({
  control,
  name,
  label,
  isDisabled = false,
}: {
  control: Control<FormData>;
  name: 'startDate' | 'endDate';
  label: string;
  isDisabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="month"
              {...field}
              disabled={isDisabled}
              value={isDisabled ? '' : field.value}
              onChange={(e) => {
                if (!isDisabled) {
                  field.onChange(e.target.value);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextareaField({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<FormData>;
  name: 'description';
  label: string;
  placeholder: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function getMutationOptions(
  action: 'create' | 'update',
  queryClient: ReturnType<typeof useQueryClient>,
  onCancel: () => void
) {
  const title =
    action === 'create'
      ? 'Experience created successfully'
      : 'Experience updated successfully';
  const errorTitle =
    action === 'create'
      ? 'Failed to create experience'
      : 'Failed to update experience';

  return {
    onSuccess: () => {
      toast({ title });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      onCancel();
    },
    onError: (error: { error: string }) => {
      toast({
        title: errorTitle,
        description: error.error,
        variant: 'destructive',
      });
    },
  };
}

export function CreateAndEditExperience({
  actionType,
  experience,
  onCancel,
}: CreateAndEditExperienceProps) {
  const queryClient = useQueryClient();

  const [tags, setTags] = useState<Tag[]>(
    experience?.technologies ? _technologies(experience.technologies) : []
  );
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const createMutation = useCreateUserExperience();
  const updateMutation = useUpdateExperience(experience?.id || 0);

  const form = useForm<FormData>({
    resolver: zodResolver(ValidationSchema),
    defaultValues: {
      company: experience?.company || '',
      position: experience?.position || '',
      location: experience?.location || '',
      employment_type: experience?.employmentType || '',
      startDate: formatDateForMonthInput(experience?.startDate || null),
      endDate: formatDateForMonthInput(experience?.endDate || null),
      current: experience?.isCurrent,
      description: experience?.description || '',
      technologies: experience?.technologies
        ? experience.technologies.join(', ')
        : '',
      achievements: experience?.achievements || '',
      responsibilities: experience?.responsibilities || '',
    },
  });

  if (!actionType || actionType === null) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const isCurrent = form.watch('current');

  const onSubmit = (data: FormData) => {
    const apiData = transformToApiData(data);

    if (actionType === 'create') {
      createMutation.mutate(
        apiData,
        getMutationOptions('create', queryClient, onCancel)
      );
    } else if (actionType === 'edit') {
      updateMutation.mutate(
        apiData,
        getMutationOptions('update', queryClient, onCancel)
      );
    }
  };

  return (
    <Card className="border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {actionType === 'edit' ? 'Edit Experience' : 'Add New Experience'}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Briefcase className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <InputField
                    control={form.control}
                    name="company"
                    label="Company Name *"
                    placeholder="e.g. TechCorp Solutions"
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    control={form.control}
                    name="position"
                    label="Position *"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    control={form.control}
                    name="location"
                    label="Location *"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={'employment_type'}
                    render={({ field }) => (
                      <FormItem className={'w-full'}>
                        <FormLabel>Employment Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Please Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentTypes.map((ele) => (
                              <SelectItem value={ele} key={ele}>
                                {ele}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DateField
                    control={form.control}
                    name="startDate"
                    label="Start Date *"
                  />
                  <DateField
                    control={form.control}
                    name="endDate"
                    label={`End Date${isCurrent ? '' : ' *'}`}
                    isDisabled={isCurrent}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="current"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Currently working here</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Award className="h-5 w-5" />
                  Experience Details
                </h3>

                <div className="space-y-2">
                  <TextareaField
                    control={form.control}
                    name="description"
                    label="Description *"
                    placeholder="Brief overview of your role and responsibilities..."
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Technologies/Skills Used <i>(Press Enter to add)</i>
                        </FormLabel>
                        <FormControl>
                          <TagInput
                            placeholder="Enter a topic"
                            tags={tags}
                            setTags={(newTags) => {
                              setTags(newTags);
                              if (Array.isArray(newTags)) {
                                form.setValue(
                                  'technologies',
                                  newTags.map((tag) => tag.text).join(', ')
                                );
                              }
                            }}
                            activeTagIndex={activeTagIndex}
                            setActiveTagIndex={setActiveTagIndex}
                            borderStyle="default"
                            variant="primary"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <EditorField
                    form={form}
                    name="achievements"
                    label="Key Achievements"
                  />
                </div>

                <div className="space-y-2">
                  <EditorField
                    form={form}
                    name="responsibilities"
                    label="Responsibilities"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type={'submit'} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading
                  ? 'Saving...'
                  : actionType === 'edit'
                    ? 'Update'
                    : 'Save'}{' '}
                Experience
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600">{error.error}</div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
