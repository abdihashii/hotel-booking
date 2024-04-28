'use client';

import { addDays } from 'date-fns';

import useBookingsForAdmin from '@/hooks/useBookingsForAdmin';
import { TUnavailableDates } from '@/types';

import { Calendar } from '../ui/calendar';
import { Loader2 } from 'lucide-react';
import BlockButtonList from './BlockButtonList';

const AvailabilityCalendar = ({
  blockNames,
  currentMonth,
  unavailableDates: uA,
}: {
  blockNames:
    | {
        block_name: string;
      }[]
    | undefined;
  currentMonth: Date;
  unavailableDates: TUnavailableDates | undefined;
}) => {
  const {
    selectedBlockName,
    handleClickSelectedBlock,
    unavailableDates,
    loading,
  } = useBookingsForAdmin(blockNames, uA);

  return (
    <section className="w-full border border-white rounded-lg flex flex-col gap-8 text-center">
      <h2 className="mt-8 font-bold text-xl">Availability Calendar</h2>

      {/* Block button list */}
      <BlockButtonList
        blockNames={blockNames!}
        selectedBlockName={selectedBlockName}
        handleChangeSelectedBlockName={handleClickSelectedBlock}
      />

      {loading ? (
        <div className="border-t border-t-white flex h-[587px] items-center justify-center w-full">
          <Loader2 className="animate-spin" size={64} />
        </div>
      ) : (
        <div className="border-t-white border-t">
          <Calendar
            className="py-8 rounded-lg flex flex-col gap-4 px-4 w-fit lg:flex-row mx-auto"
            mode="range"
            numberOfMonths={2}
            showOutsideDays={false}
            fromMonth={currentMonth}
            toMonth={addDays(currentMonth, 365)}
            modifiers={{
              unavailable: unavailableDates ?? [],
            }}
            modifiersClassNames={{
              unavailable:
                'bg-gray-300 hover:bg-gray-300 font-semibold text-gray-500 hover:text-gray-500 rounded',
            }}
          />

          <div className="border-t border-t-white">
            {unavailableDates && unavailableDates.length > 0 ? (
              <ul className="text-left space-y-8 p-8">
                {unavailableDates.map((booking) => {
                  return (
                    <li key={booking.id} className="">
                      <strong>{booking.guestName}</strong>
                      <ul className="list-disc list-inside">
                        <li>
                          {booking.from.toDateString()} --&gt;{' '}
                          {booking.to.toDateString()}
                        </li>
                        <li>Number of guests: {booking.numGuests}</li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="p-8">No bookings found for this block.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AvailabilityCalendar;
