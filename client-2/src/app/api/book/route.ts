import { bookABlock } from '@/db';

export async function POST(req: Request) {
  // get the booking data from the request body
  const { bookingData } = await req.json();

  // if no block name is provided, return an error
  if (!bookingData) {
    return new Response(JSON.stringify({ error: 'No booking data provided' }), {
      status: 400,
    });
  }

  // insert the new booking data into the database
  const booking = await bookABlock(bookingData);

  // return the booking data
  return new Response(JSON.stringify(booking), {
    status: 200,
  });
}
