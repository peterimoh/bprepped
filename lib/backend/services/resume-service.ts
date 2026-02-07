import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { NotFoundError } from '@/lib/backend/utils/custom-error';

export const ResumeQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  isDraft: z
    .boolean()
    .or(
      z
        .string()
        .optional()
        .transform((val) => val === 'true')
    )
    .optional(),
  isActive: z
    .boolean()
    .or(
      z
        .string()
        .optional()
        .transform((val) => val === 'true')
    )
    .optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

export type ResumeQueryParams = z.infer<typeof ResumeQueryParamsSchema>;

export class ResumeService {
  async getResumes(userId: number, params: ResumeQueryParams) {
    const { page, limit, isDraft, isActive, search, sort } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (isDraft !== undefined) {
      where.isDraft = isDraft;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          lastEdited: sortOrder,
        },
        select: {
          id: true,
          title: true,
          templateId: true,
          atsScore: true,
          isActive: true,
          isDraft: true,
          lastEdited: true,
          createdAt: true,
        },
      }),
      prisma.resume.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: resumes,
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
}

export const resumeService = new ResumeService();
