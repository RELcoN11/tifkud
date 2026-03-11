import { prisma } from './db';

export interface Dilemma {
  id: number;
  title: string;
  situation: string;
  affectedSequences: string;
  recommendedActions: string[];
}

// Server-side: fetch all dilemmas from DB
export async function getDilemmas(): Promise<Dilemma[]> {
  const rows = await prisma.dilemma.findMany({ orderBy: { id: 'asc' } });
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    situation: r.situation,
    affectedSequences: r.affectedSequences,
    recommendedActions: r.recommendedActions,
  }));
}

// Server-side: fetch single dilemma by id
export async function getDilemmaById(id: number): Promise<Dilemma | null> {
  const row = await prisma.dilemma.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    situation: row.situation,
    affectedSequences: row.affectedSequences,
    recommendedActions: row.recommendedActions,
  };
}

export async function getAllDilemmaIds(): Promise<number[]> {
  const rows = await prisma.dilemma.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  return rows.map(r => r.id);
}
