import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function LoadingBookingPage() {
  return (
    <Skeleton className="py-10 flex flex-col items-center gap-8 w-3/4 mx-auto border-2 border-white rounded-md">
      <Skeleton className="h-9 text-3xl text-center font-bold text-gray-800 dark:text-gray-100">
        Loading booking form...
      </Skeleton>

      <Skeleton className="items-center justify-center h-[300px] flex w-[300px] flex-col gap-8 rounded-md border border-black dark:border-white p-6">
        <Loader2 className="animate-spin w-24 h-24" />
      </Skeleton>
    </Skeleton>
  );
}
