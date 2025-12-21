import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { formatRequestError, requireAuth, NotFoundError } from '@/lib/backend';
import {
  createExperienceSchema,
  getQueryParamsSchema,
} from '@/app/api/experiences/validations';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const validatedData = createExperienceSchema.parse(body);

    // If is_current is true, set end_date to null
    if (validatedData.is_current) {
      validatedData.end_date = undefined;
    }

    // Find the user ID from the session
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NotFoundError('Account not found');
    }

    const experience = await prisma.userExperience.create({
      data: {
        userId: user.id,
        company: validatedData.company,
        position: validatedData.position,
        location: validatedData.location,
        employmentType: validatedData.employment_type,
        startDate: validatedData.start_date,
        endDate: validatedData.end_date,
        isCurrent: validatedData.is_current,
        description: validatedData.description,
        technologies: validatedData.technologies,
        achievements: validatedData.achievements,
        responsibilities: validatedData.responsibilities,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (e) {
    return formatRequestError(e);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const queryParams = Object.fromEntries(searchParams);
    const validatedParams = getQueryParamsSchema.parse(queryParams);
    const { page, limit, search, sort } = validatedParams;

    const skip = (page - 1) * limit;

    const user = await prisma.user.findFirst({
      where: { email: session.user.email as string },
      select: { id: true },
    });

    if (!user) {
      return new NotFoundError('Account not found');
    }

    const where: {
      userId: number;
      OR?: Array<{
        company?: { contains: string; mode: 'insensitive' };
        position?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      userId: user.id,
    };

    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sort order: 'latest' = desc, 'oldest' = asc
    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const [experiences, total] = await Promise.all([
      prisma.userExperience.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startDate: sortOrder,
        },
        select: {
          id: true,
          company: true,
          position: true,
          location: true,
          employmentType: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          description: true,
          technologies: true,
          achievements: true,
          responsibilities: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.userExperience.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      data: experiences,
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
