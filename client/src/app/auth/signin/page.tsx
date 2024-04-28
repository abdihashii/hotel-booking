import { getSession } from '@/lib/supabaseServerClient';
import SignInForm from './SignInForm';
import { redirect } from 'next/navigation';

export default async function signInPage() {
  const session = await getSession();

  if (session) {
    redirect('/admin');
  }

  return (
    <main className="w-3/4 mx-auto">
      <SignInForm />
    </main>
  );
}
