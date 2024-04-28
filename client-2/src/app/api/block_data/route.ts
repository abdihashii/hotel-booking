import { getBlockData } from '@/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blockName = searchParams.get('block_name');

  console.log('blockName:', blockName);

  if (!blockName) {
    return new Response(JSON.stringify({ error: 'No block name provided' }), {
      status: 400,
    });
  }

  const blockData = await getBlockData(blockName);

  if (!blockData) {
    return new Response('No block data found for block name', {
      status: 404,
    });
  }

  return new Response(JSON.stringify(blockData), {
    status: 200,
  });
}
