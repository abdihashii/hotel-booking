'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';

const BackButton = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return pathname !== '/' ? (
    <Link href="/" className={`${className}`}>
      <Button>
        <ChevronLeft />
      </Button>
    </Link>
  ) : null;
};

export default BackButton;
