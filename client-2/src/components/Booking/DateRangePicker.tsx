'use client';

import * as React from 'react';
import { addDays, format, startOfDay, startOfMonth } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

// import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FormControl } from '@/components/ui/form';

interface DateRangeField {
  value: DateRange;
  onChange: (range: DateRange | undefined) => void;
}

const DateRangePicker = ({
  field,
  unavailableDates,
}: {
  field: DateRangeField;
  unavailableDates: Array<
    | Date
    | {
        from: Date;
        to: Date;
      }
  >;
}) => {
  const handleDateChange = (range: DateRange | undefined) => {
    field.onChange(range);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            id="date"
            variant={'outline'}
            className="w-[300px] justify-start text-left font-normal dark:border-gray-600 dark:bg-gray-800"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {field.value.from ? (
              field.value.to ? (
                <>
                  {format(field.value.from, 'LLL dd, y')} -{' '}
                  {format(field.value.to, 'LLL dd, y')}
                </>
              ) : (
                <>{format(field.value.from, 'LLL dd, y')} - choose a date</>
              )
            ) : (
              'Select dates'
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        {JSON.stringify(field.value, null, 2)}

        <Calendar
          mode="range"
          defaultMonth={field.value.from}
          selected={{
            from: field.value.from,
            to: field.value.to,
          }}
          onSelect={handleDateChange}
          showOutsideDays={false}
          fromMonth={startOfMonth(new Date())} // current month
          toMonth={addDays(startOfMonth(new Date()), 365)} // 1 year
          numberOfMonths={2}
          disabled={[
            { before: startOfDay(new Date()) }, // disable dates before today
            ...unavailableDates,
          ]}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
