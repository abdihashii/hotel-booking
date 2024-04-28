import Link from 'next/link';

import { Home } from 'lucide-react';
import AvailabilityCalendar from '@/components/Admin/AvailabilityCalendar';
import { getAllBlockNames, getUnavailableDatesForBlock } from '@/db';

export default async function AdminPage() {
  const currentMonth = new Date();

  const unavailableDates = await getUnavailableDatesForBlock('Block A');
  const allBlockNames = await getAllBlockNames();

  return (
    <main className="gap-8 w-11/12 mx-auto lg:w-1/2 flex flex-col items-center justify-between py-12">
      {/* Navigation & Title */}
      <section className="w-full flex rounded-lg justify-between">
        <h1 className="text-4xl font-bold">Admin Page</h1>

        <Link
          href="/"
          className="bg-gray-600 px-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
        >
          <Home />
        </Link>
      </section>

      {/* Availability Calendar with Border */}
      <AvailabilityCalendar
        blockNames={allBlockNames}
        currentMonth={currentMonth}
        unavailableDates={unavailableDates}
      />
    </main>
  );
}
