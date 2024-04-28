import { db } from '@/db';
import { blocks } from '@/schema';

import BlockCard from '@/components/Booking/BlockCard';
import { LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const allBlocks = await db.select().from(blocks);

  return (
    <main className="gap-8 w-11/12 mx-auto lg:w-1/2 flex flex-col items-center justify-between pt-12">
      <section className="w-full flex flex-row gap-8 rounded-lg justify-between">
        <h1 className="text-4xl font-bold">Blocks</h1>

        <Link
          href="/admin"
          className="bg-gray-600 px-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
        >
          <LockKeyhole />
        </Link>
      </section>

      <section className="w-full">
        <ul className="grid grid-cols-2 gap-8">
          {allBlocks.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))}
        </ul>
      </section>
    </main>
  );
}
