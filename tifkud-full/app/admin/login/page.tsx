import { getAdminFromCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from './_components/login-client';

export default async function LoginPage() {
  const admin = await getAdminFromCookie();
  if (admin) redirect('/admin');

  return <LoginClient />;
}
