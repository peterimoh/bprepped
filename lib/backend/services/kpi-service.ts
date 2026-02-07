import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/backend/utils/custom-error';

export interface UserKpis {
  current_balance: number;
  total_purchased: number;
  resume_count: number;
  scan_count: number;
  interview_prep_count: number;
}

export class KpiService {
  async getUserKpis(userId: number): Promise<UserKpis> {
    const token = await prisma.tokenBalance.findFirst({
      where: { userId },
    });

    if (!token) {
      throw new NotFoundError('No token created');
    }

    const [resumes, scans, preps] = await Promise.all([
      prisma.resume.count({
        where: { userId },
      }),
      prisma.resumeScan.count({
        where: { userId },
      }),
      prisma.interviewSession.count({
        where: { userId },
      }),
    ]);

    return {
      current_balance: token.currentBalance ?? 0,
      total_purchased: token.totalPurchased ?? 0,
      resume_count: resumes,
      scan_count: scans,
      interview_prep_count: preps,
    };
  }
}

export const kpiService = new KpiService();
