import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminFromCookie } from '@/lib/auth';

// PUT /api/dilemmas/[id] — admin only, update dilemma
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'מזהה לא תקין' }, { status: 400 });

  const body = await req.json();
  const { title, situation, affectedSequences, recommendedActions } = body;

  if (!title?.trim() || !situation?.trim()) {
    return NextResponse.json({ error: 'כותרת ותיאור נדרשים' }, { status: 400 });
  }

  try {
    const dilemma = await prisma.dilemma.update({
      where: { id },
      data: {
        title: title.trim(),
        situation: situation.trim(),
        affectedSequences: affectedSequences?.trim() || '',
        recommendedActions: (recommendedActions || []).filter((a: string) => a.trim()),
      },
    });
    return NextResponse.json(dilemma);
  } catch {
    return NextResponse.json({ error: 'דילמה לא נמצאה' }, { status: 404 });
  }
}

// DELETE /api/dilemmas/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'מזהה לא תקין' }, { status: 400 });

  try {
    await prisma.dilemma.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'דילמה לא נמצאה' }, { status: 404 });
  }
}
