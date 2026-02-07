import { NextRequest, NextResponse } from 'next/server';

import { formatRequestError, requireAuth } from '@/lib/backend';
import {
  experienceService,
  UpdateExperienceSchema,
  IdSchema,
} from '@/lib/backend/services/experience-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = IdSchema.parse(await params);

    const experience = await experienceService.getExperienceById(
      session.user.email!,
      id
    );

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
    const { id } = IdSchema.parse(await params);

    const body = await request.json();
    const validatedData = UpdateExperienceSchema.parse(body);

    const experience = await experienceService.updateExperience(
      session.user.email!,
      id,
      validatedData
    );

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
    const { id } = IdSchema.parse(await params);

    const result = await experienceService.deleteExperience(
      session.user.email!,
      id
    );

    return NextResponse.json(result);
  } catch (e) {
    return formatRequestError(e);
  }
}
