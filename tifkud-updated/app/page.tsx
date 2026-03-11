import { getDilemmas } from '@/lib/dilemmas';
import { getAdminFromCookie } from '@/lib/auth';
import HomeClient from '@/components/home-client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [dilemmas, admin] = await Promise.all([
    getDilemmas(),
    getAdminFromCookie(),
  ]);

  return <HomeClient dilemmas={dilemmas} isAdmin={!!admin} />;
}
