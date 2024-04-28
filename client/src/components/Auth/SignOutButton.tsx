'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const SignOutButton = () => {
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={'destructive'} className="ml-4" onClick={handleSignOut}>
      {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Out'}
    </Button>
  );
};

export default SignOutButton;
