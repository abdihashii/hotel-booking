import { startOfDay } from 'date-fns';
import * as z from 'zod';

export const bookingFormSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Full name is required',
    }),
    guests: z
      .number()
      .min(1, {
        message: 'Number of guests must be at least 1',
      })
      .max(6, {
        message: 'Number of guests must be at most 6',
      }),

    dateRange: z
      .object({
        from: z
          .date({
            required_error: 'Check in date is required',
          })
          .refine(
            function (date) {
              return startOfDay(date) >= startOfDay(new Date());
            },
            {
              message: 'Check in date must be a future date',
            }
          ),
        to: z.date({
          required_error: 'Check out date is required',
        }),
      })
      .refine(
        function (date) {
          return startOfDay(date.to) > startOfDay(date.from);
        },
        {
          message:
            'Check out date must be at least one day after the check in date',
        }
      ),
  })
  .required();
