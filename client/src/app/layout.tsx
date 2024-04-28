import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { getSession } from '@/lib/supabaseServerClient';

import { ThemeProvider } from '@/components/theme-provider';
import DarkModeToggle from '@/components/DarkModeToggle';
import BackButton from '@/components/BackButton';
import AuthProvider from '@/components/Auth/AuthProvider';
import SignOutButton from '@/components/Auth/SignOutButton';
import { Toaster } from '@/components/ui/toaster';
import { ShieldCheck } from 'lucide-react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hotel Booking App',
  description: 'Created using Next.js, TypeScript, Tailwind CSS, and Supabase',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const accessToken = session?.access_token ?? null;

  return (
    <html lang="en">
      <body
        className={`${inter.className} py-8 bg-gray-100 dark:bg-gray-800 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="mb-8 w-3/4 mx-auto flex flex-row items-center justify-between">
            <BackButton className="mr-auto" />

            <DarkModeToggle className="ml-auto" />

            {session && (
              <>
                <SignOutButton />

                <Link href="/admin">
                  <ShieldCheck className="ml-4" />
                </Link>
              </>
            )}
          </header>

          <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
