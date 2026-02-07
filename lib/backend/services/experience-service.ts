import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { NotFoundError } from '@/lib/backend/utils/custom-error';

export const CreateExperienceSchema = z.object({
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
    .boolean()
    .default(false)
    .or(
      z
        .string()
        .optional()
        .transform((val) => val === 'true')
    ),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional().default([]),
  achievements: z.string().optional(),
  responsibilities: z.string().optional(),
});

export const ExperienceQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

export const UpdateExperienceSchema = z.object({
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
    .boolean()
    .or(
      z
        .string()
        .optional()
        .transform((val) => val === 'true')
    )
    .optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.string().optional(),
  responsibilities: z.string().optional(),
});

export const IdSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export type CreateExperienceData = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceData = z.infer<typeof UpdateExperienceSchema>;
export type ExperienceQueryParams = z.infer<typeof ExperienceQueryParamsSchema>;
export type IdData = z.infer<typeof IdSchema>;

export class ExperienceService {
  async getExperiences(userEmail: string, params: ExperienceQueryParams) {
    const { page, limit, search, sort } = params;
    const skip = (page - 1) * limit;

    const user = await this.getUserByEmail(userEmail);

    const where: any = {
      userId: user.id,
    };

    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const [experiences, total] = await Promise.all([
      prisma.userExperience.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startDate: sortOrder,
        },
      }),
      prisma.userExperience.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: experiences,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async createExperience(userEmail: string, data: CreateExperienceData) {
    const user = await this.getUserByEmail(userEmail);

    // Business logic: If is_current is true, set end_date to undefined
    const experienceData = {
      ...data,
      end_date: data.is_current ? undefined : data.end_date,
    };

    return await prisma.userExperience.create({
      data: {
        userId: user.id,
        company: experienceData.company,
        position: experienceData.position,
        location: experienceData.location,
        employmentType: experienceData.employment_type,
        startDate: experienceData.start_date,
        endDate: experienceData.end_date,
        isCurrent: !!experienceData.is_current,
        description: experienceData.description,
        technologies: experienceData.technologies,
        achievements: experienceData.achievements,
        responsibilities: experienceData.responsibilities,
      },
    });
  }

  async getExperienceById(userEmail: string, id: number) {
    const user = await this.getUserByEmail(userEmail);

    const experience = await prisma.userExperience.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!experience) {
      throw new NotFoundError('Experience not found');
    }

    return experience;
  }

  async updateExperience(
    userEmail: string,
    id: number,
    data: UpdateExperienceData
  ) {
    const user = await this.getUserByEmail(userEmail);

    // 1. Check if the experience exists and belongs to the user
    const existingExperience = await prisma.userExperience.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingExperience) {
      throw new NotFoundError('Experience not found');
    }

    // 2. Business logic: If is_current is true, set end_date to null
    if (data.is_current === true) {
      data.end_date = undefined;
    }

    // 3. Update the experience
    return await prisma.userExperience.update({
      where: { id },
      data: {
        ...(data.company !== undefined && { company: data.company }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.employment_type !== undefined && {
          employmentType: data.employment_type,
        }),
        ...(data.start_date !== undefined && { startDate: data.start_date }),
        ...(data.end_date !== undefined && { endDate: data.end_date }),
        ...(data.is_current !== undefined && { isCurrent: !!data.is_current }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.technologies !== undefined && {
          technologies: data.technologies,
        }),
        ...(data.achievements !== undefined && {
          achievements: data.achievements,
        }),
        ...(data.responsibilities !== undefined && {
          responsibilities: data.responsibilities,
        }),
      },
    });
  }

  async deleteExperience(userEmail: string, id: number) {
    const user = await this.getUserByEmail(userEmail);

    const existingExperience = await prisma.userExperience.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingExperience) {
      throw new NotFoundError('Experience not found');
    }

    await prisma.userExperience.delete({
      where: { id },
    });

    return { message: 'Experience deleted successfully' };
  }

  private async getUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError('Account not found');
    }

    return user;
  }
}

export const experienceService = new ExperienceService();
