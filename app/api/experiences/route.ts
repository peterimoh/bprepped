import { NextRequest, NextResponse } from 'next/server';
import { formatRequestError, requireAuth } from '@/lib/backend';
import {
  experienceService,
  CreateExperienceSchema,
  ExperienceQueryParamsSchema,
} from '@/lib/backend/services/experience-service';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const validatedData = CreateExperienceSchema.parse(body);

    const experience = await experienceService.createExperience(
      session.user.email!,
      validatedData
    );

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
    const validatedParams = ExperienceQueryParamsSchema.parse(queryParams);

    const result = await experienceService.getExperiences(
      session.user.email!,
      validatedParams
    );

    return NextResponse.json(result);
  } catch (e) {
    return formatRequestError(e);
  }
}
