import { toZonedTime } from 'date-fns-tz';
import { getUnavailableDatesForBlock } from '@/db';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blockName = searchParams.get('block_name');

  console.log('blockName:', blockName);

  if (!blockName) {
    return new Response(JSON.stringify({ error: 'No block name provided' }), {
      status: 400,
    });
  }

  const unavailableDates = await getUnavailableDatesForBlock(blockName);

  if (!unavailableDates) {
    return new Response(
      JSON.stringify({
        blockName,
        unavailableDates: [],
      })
    );
  }

  const formattedUnavailableDates = unavailableDates.map((date) => {
    const from = toZonedTime(date.from, 'UTC');
    const to = toZonedTime(date.to, 'UTC');

    return {
      ...date,
      from,
      to,
    };
  });

  console.log('formattedUnavailableDates:', formattedUnavailableDates);

  return new Response(
    JSON.stringify({ blockName, unavailableDates: formattedUnavailableDates }),
    {
      status: 200,
    }
  );
}
