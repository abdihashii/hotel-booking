import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createDateRanges } from '@/lib/utils';

import { Bookings } from '@/types';
import { Database } from '@/types/database.types';

export default function useBookings({ blockName }: { blockName: string }) {
  const supabase = createClientComponentClient<Database>();

  const [unavailableDates, setUnavailableDates] = useState<
    Array<Date | { from: Date; to: Date }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Process bookings and create date ranges for each booking to be used in
   * the calendar.
   * @param bookings - List of bookings
   * @returns - List of date ranges
   */
  const processBookingDates = (bookings: Bookings[]) =>
    bookings.map((booking) =>
      createDateRanges(
        new Date(booking.check_in_date),
        new Date(booking.checkout_date)
      )
    );

  /**
   * Fetch unavailable dates for a specific block name from the database.
   * @returns - List of unavailable dates for the block
   */
  const handleGetUnavailableDates = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select()
        .eq('block_name', blockName)
        .order('check_in_date', { ascending: true });

      if (error) throw error;

      const processedDates = processBookingDates(data);

      setUnavailableDates(processedDates);

      return processedDates;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Book a block for a specific guest.
   * @param values - Booking values such as date range and number of guests
   * @param guestName - Name of the guest
   */
  const bookABlock = async (
    values: {
      dateRange: {
        from: string;
        to: string;
      };
      guests: number;
    },
    guestName: string
  ) => {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .insert([
        {
          guest_name: guestName,
          block_name: blockName,
          check_in_date: values.dateRange.from,
          checkout_date: values.dateRange.to,
          num_guests: values.guests,
        },
      ])
      .select();

    if (error) throw error;

    alert(JSON.stringify(bookings, null, 2));

    debugger;

    const processedDates = processBookingDates(bookings);

    setUnavailableDates(processedDates);
  };

  return {
    unavailableDates,
    setUnavailableDates,
    isLoading,
    setIsLoading,
    handleGetUnavailableDates,
    bookABlock,
  };
}
