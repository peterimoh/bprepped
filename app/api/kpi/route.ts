import { NextResponse } from 'next/server';
import {
  requireAuth,
  formatRequestError,
  NotFoundError,
} from '@/lib/backend/utils';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { user } = await requireAuth();
    const token = await prisma.tokenBalance.findFirst({
      where: { userId: Number(user.id) },
    });

    if (!token) throw new NotFoundError('No token created');

    const resumes = await prisma.resume.count({
      where: { userId: Number(user.id) },
    });

    const scans = await prisma.resumeScan.count({
      where: { userId: Number(user.id) },
    });

    const preps = await prisma.interviewSession.count({
      where: { userId: Number(user.id) },
    });

    return NextResponse.json({
      current_balance: token.currentBalance,
      total_purchased: token.totalPurchased,
      resume_count: resumes,
      scan_count: scans,
      interview_prep_count: preps,
    });
  } catch (e) {
    return formatRequestError(e);
  }
}
