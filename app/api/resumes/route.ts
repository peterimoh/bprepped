import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formatRequestError, requireAuth } from '@/lib/backend/utils';
import { prisma } from '@/lib/prisma';

const queryParamsSchema = z.object({
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
  isDraft: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .pipe(z.boolean().optional()),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .pipe(z.boolean().optional()),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const queryParams = Object.fromEntries(searchParams);

    const validatedParams = queryParamsSchema.parse(queryParams);
    const { page, limit, isDraft, isActive, search, sort } = validatedParams;

    const skip = (page - 1) * limit;

    const where: {
      userId: number;
      isDraft?: boolean;
      isActive?: boolean;
      title?: { contains: string; mode: 'insensitive' };
    } = {
      userId: Number(user.id),
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

    // Determine sort order: 'latest' = desc, 'oldest' = asc
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
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      data: resumes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (e) {
    return formatRequestError(e);
  }
}
