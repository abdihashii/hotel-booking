import { Skeleton } from '@/components/ui/skeleton';
import { LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export default function LoadingHome() {
  return (
    <main className="flex flex-col items-center justify-between pt-12">
      <section className="w-11/12 mx-auto lg:w-1/2 flex flex-col gap-8 rounded-lg p-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-bold">Blocks</h1>

          <Link
            href="/admin/block-a"
            className="bg-gray-600 px-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
          >
            <LockKeyhole />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((block) => (
            <Skeleton
              className="border border-white rounded-lg p-4 text-center flex flex-col gap-4 h-80"
              key={block}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
