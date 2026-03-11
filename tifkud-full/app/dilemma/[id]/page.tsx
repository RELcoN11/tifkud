import { notFound } from 'next/navigation';
import { getDilemmaById, getAllDilemmaIds } from '@/lib/dilemmas';
import { getAdminFromCookie } from '@/lib/auth';
import DilemmaContent from './_components/dilemma-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const dilemma = await getDilemmaById(parseInt(params.id, 10));
  return {
    title: dilemma?.title ? `${dilemma.title} | מחולל הדילמות` : 'דילמה לא נמצאה',
    description: dilemma?.situation ?? 'דילמה פיקודית לפי מודל הרצפים',
  };
}

export default async function DilemmaPage({ params }: { params: { id: string } }) {
  const [dilemma, admin] = await Promise.all([
    getDilemmaById(parseInt(params.id, 10)),
    getAdminFromCookie(),
  ]);

  if (!dilemma) notFound();

  return <DilemmaContent dilemma={dilemma} isAdmin={!!admin} />;
}
