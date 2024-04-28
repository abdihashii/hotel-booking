import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/supabaseServerClient';
import Link from 'next/link';
import AdminPage from './AdminPage';

export default async function adminPage() {
  const user = await getUser();

  return (
    <main className="w-3/4 mx-auto">
      {user ? (
        <AdminPage />
      ) : (
        <section className="w-full flex flex-col gap-4 items-center">
          <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100">
            Access Denied
          </h1>

          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </section>
      )}
    </main>
  );
}
