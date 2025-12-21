import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useState, useEffect } from 'react';
import { useCreateUserExperience } from '@/lib/api-hooks/experiences';
import { toast } from 'sonner';

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
  actionType: 'create' | 'edit';
  experience?: any;
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

export function CreateAndEditExperience({
  actionType,
  experience,
  onCancel,
}: CreateAndEditExperienceProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  // Create and update mutations
  const createMutation = useCreateUserExperience();

  // Determine if we're in a loading state
  const isLoading = createMutation.isPending;

  // Get error state
  const error = createMutation.error;

  const form = useForm<FormData>({
    resolver: zodResolver(ValidationSchema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: '',
      achievements: '',
      responsibilities: '',
    },
  });

  // Populate form with experience data when in edit mode
  // useEffect(() => {
  //   if (experienceData && actionType === 'edit') {
  //     // Convert date objects to YYYY-MM format for month input
  //     const formatDate = (date: Date | null | string) => {
  //       if (!date) return '';
  //       const d = new Date(date);
  //       return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  //     };
  //
  //     // Convert technologies array to comma-separated string for display
  //     const technologiesString = Array.isArray(experienceData.technologies)
  //       ? experienceData.technologies.join(', ')
  //       : experienceData.technologies || '';
  //
  //     // Convert tags from technologies for TagInput
  //     const techTags = Array.isArray(experienceData.technologies)
  //       ? experienceData.technologies.map((tech, index) => ({
  //           id: index.toString(),
  //           text: tech,
  //         }))
  //       : [];
  //
  //     setTags(techTags);
  //
  //     form.reset({
  //       company: experienceData.company || '',
  //       position: experienceData.position || '',
  //       location: experienceData.location || '',
  //       startDate: formatDate(experienceData.startDate),
  //       endDate: formatDate(experienceData.endDate),
  //       current: experienceData.isCurrent || false,
  //       description: experienceData.description || '',
  //       technologies: technologiesString,
  //       achievements: experienceData.achievements || '',
  //       responsibilities: experienceData.responsibilities || '',
  //       employment_type: experienceData.employmentType || '',
  //     });
  //   }
  // }, [experienceData, actionType, form]);

  // Watch the current field to disable end date when checked
  const isCurrent = form.watch('current');

  const onSubmit = (data: FormData) => {
    // Convert technologies string to array
    const technologiesArray = data.technologies
      ? data.technologies
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean)
      : [];

    const submitData = {
      company: data.company,
      position: data.position,
      location: data.location,
      employment_type: data.employment_type,
      start_date: data.startDate,
      end_date: data.endDate,
      is_current: data.current,
      description: data.description,
      technologies: technologiesArray,
      achievements: data.achievements,
      responsibilities: data.responsibilities,
    };

    if (actionType === 'create') {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success('Experience created successfully!');
          onCancel();
        },
        onError: (error) => {
          toast.error(`Failed to create experience: ${error.error}`);
        },
      });
    } else {
      // updateMutation.mutate(submitData, {
      //   onSuccess: () => {
      //     toast.success('Experience updated successfully!');
      //     onCancel();
      //   },
      //   onError: (error) => {
      //     toast.error(`Failed to update experience: ${error.error}`);
      //   },
      // });
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
                  <FormField
                    control={form.control}
                    name={'company'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={'e.g. TechCorp Solutions'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{field.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={'position'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={'e.g. Senior Frontend Developer'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{field.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={'location'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={'e.g. San Francisco, CA'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{field.message}</FormMessage>
                      </FormItem>
                    )}
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
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={'startDate'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                          <FormControl>
                            <Input type={'month'} {...field} />
                          </FormControl>
                          <FormMessage>{field.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={'endDate'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date {!isCurrent && '*'}</FormLabel>
                          <FormControl>
                            <Input
                              type={'month'}
                              {...field}
                              disabled={isCurrent}
                              value={isCurrent ? '' : field.value}
                              onChange={(e) => {
                                if (!isCurrent) {
                                  field.onChange(e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage>{field.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
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
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            id="description"
                            placeholder={
                              'Brief overview of your role and responsibilities...'
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{field.message}</FormMessage>
                      </FormItem>
                    )}
                    name={'description'}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={'technologies'}
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
                            borderStyle={'default'}
                            variant={'primary'}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    name={'achievements'}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Achievements</FormLabel>
                        <FormControl>
                          <Textarea
                            id="achievements"
                            placeholder="• Improved performance by 40%&#10;• Led team of 5 developers&#10;• Reduced bugs by 60%"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{field.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    name={'responsibilities'}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsibilities</FormLabel>
                        <FormControl>
                          <Textarea
                            id="responsibilities"
                            placeholder="• Developed frontend applications&#10;• Conducted code reviews&#10;• Mentored junior developers"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{field.message}</FormMessage>
                      </FormItem>
                    )}
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
