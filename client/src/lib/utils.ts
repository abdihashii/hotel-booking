import { type ClassValue, clsx } from 'clsx';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const findNearestAvailableDateRange = (uDs: any[]) => {
  const today = startOfDay(new Date());
  let nearestAvailableDate = addDays(today, 1);

  // Sort the unavailable dates by the start of the range
  const sortedUnavailableDates = uDs.sort(
    (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime(),
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

export const createDateRanges = (from: Date, to: Date) => {
  // If the from and to dates are the same, just return a single date
  if (from.getTime() === to.getTime()) {
    return new Date(from);
  }

  // Otherwise, return a range
  return { from: new Date(from), to: new Date(to) };
};

export const sanitizeBlockName = (bN: string) => {
  // split between the dash
  let [block, name] = bN.split('-');

  // set block to title case
  block = block.charAt(0).toUpperCase() + block.slice(1);

  return `${block}-${name.toUpperCase()}`;
};
