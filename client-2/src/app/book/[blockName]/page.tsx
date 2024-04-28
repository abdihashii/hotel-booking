'use client';

/* Libraries & Utils
 *****************************************************************************/
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { addDays } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import * as z from 'zod';
import { findNearestAvailableDateRange, normalizeBlockName } from '@/lib/utils';

/* Types & Schemas
 *****************************************************************************/
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TUnavailableDates } from '@/types';
import { bookingFormSchema } from '@/types/schemas';

/* Components
 *****************************************************************************/
import { Home, LockKeyhole } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import DateRangePicker from '@/components/Booking/DateRangePicker';

export default function BookABlockPage({
  params,
}: {
  params: {
    blockName: string;
  };
}) {
  const [blockData, setBlockData] = useState<{
    id: string;
    block_name: string;
    image_url: string | null;
    image_alt: string | null;
    unavailableDates: TUnavailableDates;
  } | null>(null);
  const normalizedBlockName = normalizeBlockName(params.blockName);

  // 1. Define a form
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      guests: 2,
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
    },
  });

  // 2. Define a submit handler
  const onSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    const checkInDate = new Date(values.dateRange.from);
    checkInDate.setUTCHours(12, 0, 0); // guests must check in 12 PM or later

    const checkOutDate = new Date(values.dateRange.to);
    checkOutDate.setUTCHours(10, 0, 0); // guests must check out 10 AM or earlier

    const formattedDateRange = {
      from: formatInTimeZone(checkInDate, 'UTC', 'yyyy-MM-dd HH:mm:ssXXX'),
      to: formatInTimeZone(checkOutDate, 'UTC', 'yyyy-MM-dd HH:mm:ssXXX'),
    };

    const formattedValues = {
      ...values,
      dateRange: formattedDateRange,
      blockName: normalizeBlockName(params.blockName),
    };

    const res = await fetch(`/api/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingData: formattedValues }),
    });

    if (!res.ok) {
      throw new Error('Failed to book block');
    }

    const data:
      | {
          guestName: string;
          blockName: string;
          checkInDate: string;
          checkOutDate: string;
          numGuests: number;
        }[]
      | undefined = await res.json();

    if (!data) {
      throw new Error('Failed to book block, no data returned');
    }

    alert(
      `Successfully booked ${data[0].blockName} for ${data[0].guestName} for ${data[0].numGuests} guests from ${data[0].checkInDate} to ${data[0].checkOutDate}`
    );

    // reset the form
    form.reset();
  };

  useEffect(() => {
    async function fetchBlockData(blockName: string) {
      try {
        const blockNameDataRes = await fetch(
          `/api/block_data?block_name=${encodeURIComponent(blockName)}`
        );

        if (!blockNameDataRes.ok) {
          throw new Error(
            `Failed to fetch block data for block name: ${blockName}`
          );
        }

        const bD = await blockNameDataRes.json();

        if (!bD) {
          throw new Error(`No block data found for block name: ${blockName}`);
        }

        const uDRes = await fetch(
          `/api/unavailable_dates?block_name=${bD.block_name}`
        );

        if (!uDRes.ok) {
          throw new Error(
            `Failed to fetch unavailable dates for block name: ${blockName}`
          );
        }

        const data: {
          blockName: string;
          unavailableDates: TUnavailableDates;
        } = await uDRes.json();

        const formattedUnavailableDates = data.unavailableDates.map((date) => ({
          // we need to make sure the date string is in the correct timezone
          from: toZonedTime(new Date(date.from), 'UTC'),
          to: toZonedTime(new Date(date.to), 'UTC'),
        }));

        // Find the nearest available date range and set the initial date range
        // to it.
        const nearestAvailableDateRange = findNearestAvailableDateRange(
          formattedUnavailableDates
        );

        form.setValue('dateRange', {
          from: nearestAvailableDateRange.from,
          to: nearestAvailableDateRange.to,
        });

        const processedBlockData = {
          ...bD,
          unavailableDates: formattedUnavailableDates,
        };

        setBlockData(processedBlockData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBlockData(normalizedBlockName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="gap-8 w-11/12 mx-auto lg:w-1/2 flex flex-col items-center pt-12">
      <section className="w-full flex flex-row gap-8 rounded-lg justify-between">
        <h1 className="text-4xl font-bold">Book {normalizedBlockName}</h1>

        <Link
          href="/"
          className="bg-gray-600 px-2 rounded-lg hover:bg-gray-700 flex items-center justify-center ml-auto"
        >
          <Home />
        </Link>

        <Link
          href={`/admin/${params.blockName}`}
          className="bg-gray-600 px-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
        >
          <LockKeyhole />
        </Link>
      </section>

      <section className="p-8 w-full border border-white rounded-lg flex flex-row gap-8">
        <Form {...form}>
          <form
            className="w-1/2 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Please enter your full name..."
                    onChange={(e) => field.onChange(e.target.value)}
                  />

                  {error ? (
                    <FormMessage>{error.message}</FormMessage>
                  ) : (
                    <p className="h-5"></p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guests"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel htmlFor="guests">Number of Guests</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      max={6}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>

                  {error ? (
                    <FormMessage>{error.message}</FormMessage>
                  ) : (
                    <p className="h-5"></p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>

                  <DateRangePicker
                    field={field}
                    unavailableDates={blockData?.unavailableDates ?? []}
                  />

                  {error && (error as any).from && (
                    <p className="text-destructive text-sm font-medium">
                      {(error as any).from.message}
                    </p>
                  )}
                  {error && (error as any).to && (
                    <p className="text-destructive text-sm font-medium">
                      {(error as any).to.message}
                    </p>
                  )}

                  {/* An empty p tag to fill space for error UI */}
                  {!error && <p className="h-5"></p>}
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              type="submit"
            >
              Book
            </Button>
          </form>
        </Form>

        <div className="relative w-1/2 h-auto">
          {blockData && (
            <Image
              src={blockData.image_url!}
              alt={blockData.image_alt!}
              className="object-cover rounded-lg"
              fill={true}
              sizes="(min-width: 640px) 50vw, 100vw"
              priority={true}
            />
          )}
        </div>
      </section>
    </main>
  );
}
