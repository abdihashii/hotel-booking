import { TBlock } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlockCard = ({ block }: { block: TBlock }) => {
  const normalizedBlockName = block.block_name
    .replace(/\s/g, '-')
    .toLowerCase();

  return (
    <li className="border border-white rounded-lg p-4 text-center flex flex-col gap-4 h-80">
      <h2 className="font-medium">{block.block_name}</h2>

      <div className="relative h-3/4">
        <Image
          className="object-cover rounded-lg"
          src={block.image_url!}
          alt={block.image_alt_text!}
          fill={true}
        />
      </div>

      <Link
        href={`/book/${normalizedBlockName}`}
        className="mt-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg"
      >
        Book
      </Link>
    </li>
  );
};

export default BlockCard;
