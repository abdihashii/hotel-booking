'use client';

import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const DarkModeToggle = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={className}
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  );
};

export default DarkModeToggle;
