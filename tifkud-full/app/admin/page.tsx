import { getAdminFromCookie } from '@/lib/auth';
import { getDilemmas } from '@/lib/dilemmas';
import { redirect } from 'next/navigation';
import AdminClient from './_components/admin-client';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  const dilemmas = await getDilemmas();

  return <AdminClient dilemmas={dilemmas} adminUsername={admin.username} />;
}
