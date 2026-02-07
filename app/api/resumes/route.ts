import { NextRequest, NextResponse } from 'next/server';
import { formatRequestError, requireAuth } from '@/lib/backend/utils';
import {
  resumeService,
  ResumeQueryParamsSchema,
} from '@/lib/backend/services/resume-service';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const queryParams = Object.fromEntries(searchParams);

    const validatedParams = ResumeQueryParamsSchema.parse(queryParams);

    const result = await resumeService.getResumes(
      Number(session.user.id),
      validatedParams
    );

    return NextResponse.json(result);
  } catch (e) {
    return formatRequestError(e);
  }
}
