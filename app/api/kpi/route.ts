import { NextResponse } from 'next/server';
import { requireAuth, formatRequestError } from '@/lib/backend';
import { kpiService } from '@/lib/backend/services/kpi-service';

export async function GET() {
  try {
    const session = await requireAuth();
    const kpis = await kpiService.getUserKpis(Number(session.user.id));

    return NextResponse.json(kpis);
  } catch (e) {
    return formatRequestError(e);
  }
}
