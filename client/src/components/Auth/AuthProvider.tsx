'use client';

import { createContext, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext(null);

// This component is used to refresh the page when the auth state changes
const AuthProvider = ({
  accessToken,
  children,
}: {
  accessToken: string | null;
  children: React.ReactNode;
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Whenever the auth state changes and the access token changes, refresh the page
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    // Unsubscribe from the auth state change event when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
};

export default AuthProvider;
