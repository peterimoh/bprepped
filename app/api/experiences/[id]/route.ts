import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { formatRequestError, requireAuth, NotFoundError } from '@/lib/backend';
import {
  updateExperienceSchema,
  idSchema,
} from '@/app/api/experiences/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = idSchema.parse(await params);

    // Find the user ID from the session
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NotFoundError('Account not found');
    }

    const experience = await prisma.userExperience.findFirst({
      where: {
        id,
        userId: user.id,
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
    });

    if (!experience) {
      return new NotFoundError('Experience not found');
    }

    return NextResponse.json(experience);
  } catch (e) {
    return formatRequestError(e);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = idSchema.parse(await params);

    const body = await request.json();
    const validatedData = updateExperienceSchema.parse(body);

    // Find the user ID from the session
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NotFoundError('Account not found');
    }

    // Check if the experience exists and belongs to the user
    const existingExperience = await prisma.userExperience.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingExperience) {
      return new NotFoundError('Experience not found');
    }

    // If is_current is true, set end_date to null
    if (validatedData.is_current === true) {
      validatedData.end_date = undefined;
    }

    const experience = await prisma.userExperience.update({
      where: { id },
      data: {
        ...(validatedData.company !== undefined && {
          company: validatedData.company,
        }),
        ...(validatedData.position !== undefined && {
          position: validatedData.position,
        }),
        ...(validatedData.location !== undefined && {
          location: validatedData.location,
        }),
        ...(validatedData.employment_type !== undefined && {
          employmentType: validatedData.employment_type,
        }),
        ...(validatedData.start_date !== undefined && {
          startDate: validatedData.start_date,
        }),
        ...(validatedData.end_date !== undefined && {
          endDate: validatedData.end_date,
        }),
        ...(validatedData.is_current !== undefined && {
          isCurrent: validatedData.is_current,
        }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.technologies !== undefined && {
          technologies: validatedData.technologies,
        }),
        ...(validatedData.achievements !== undefined && {
          achievements: validatedData.achievements,
        }),
        ...(validatedData.responsibilities !== undefined && {
          responsibilities: validatedData.responsibilities,
        }),
      },
    });

    return NextResponse.json(experience);
  } catch (e) {
    return formatRequestError(e);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = idSchema.parse(await params);

    // Find the user ID from the session
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NotFoundError('Account not found');
    }

    // Check if the experience exists and belongs to the user
    const existingExperience = await prisma.userExperience.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingExperience) {
      return new NotFoundError('Experience not found');
    }

    await prisma.userExperience.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (e) {
    return formatRequestError(e);
  }
}
