import { type ClassValue, clsx } from 'clsx';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const findNearestAvailableDateRange = (uDs: any[]) => {
  // get today's date in UTC
  const todayInUTC = toZonedTime(new Date(), 'UTC');

  // to find the nearest available date, start with tomorrow at 00:00
  let nearestAvailableDate = addDays(startOfDay(todayInUTC), 1);

  // Sort the unavailable dates by the start of the range
  const sortedUnavailableDates = uDs.sort(
    (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
  );

  for (const range of sortedUnavailableDates) {
    const fromDate = startOfDay(new Date(range.from));
    const toDate = startOfDay(new Date(range.to));

    if (isBefore(nearestAvailableDate, fromDate)) {
      break; // Found an available date before the next unavailable range
    } else if (isAfter(nearestAvailableDate, toDate)) {
      // If the current nearestAvailableDate is after the current range, keep it
      continue;
    } else {
      // Move the nearest available date to the day after the current range ends
      nearestAvailableDate = addDays(toDate, 1);
    }
  }

  return {
    from: nearestAvailableDate,
    to: addDays(nearestAvailableDate, 1),
  };
};
