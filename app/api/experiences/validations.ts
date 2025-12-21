import { z } from 'zod';

const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  start_date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  end_date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  is_current: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .pipe(z.boolean().default(false)),
  description: z.string().optional(),
  technologies: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val : [])),
  achievements: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val : [])),
  responsibilities: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val : [])),
});

const getQueryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1).default(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(100).default(10)),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

const updateExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required').optional(),
  position: z.string().min(1, 'Position is required').optional(),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  start_date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  end_date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  is_current: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .pipe(z.boolean().default(false))
    .optional(),
  description: z.string().optional(),
  technologies: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val : []))
    .optional(),
  achievements: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val : []))
    .optional(),
  responsibilities: z
    .array(z.string())
    .optional()
    .transform((val) => (val ? val : []))
    .optional(),
});

const idSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(1)),
});

export { createExperienceSchema, updateExperienceSchema, getQueryParamsSchema, idSchema };
