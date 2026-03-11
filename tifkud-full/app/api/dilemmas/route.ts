import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';

// GET /api/dilemmas — public, returns all dilemmas
export async function GET() {
  const dilemmas = await prisma.dilemma.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(dilemmas);
}

// POST /api/dilemmas — admin only, create new dilemma
export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const body = await req.json();
  const { title, situation, affectedSequences, recommendedActions } = body;

  if (!title?.trim() || !situation?.trim()) {
    return NextResponse.json({ error: 'כותרת ותיאור נדרשים' }, { status: 400 });
  }

  const dilemma = await prisma.dilemma.create({
    data: {
      title: title.trim(),
      situation: situation.trim(),
      affectedSequences: affectedSequences?.trim() || '',
      recommendedActions: (recommendedActions || []).filter((a: string) => a.trim()),
    },
  });
  return NextResponse.json(dilemma, { status: 201 });
}
