'use client';

import React from 'react';
import Link from 'next/link';

const BlockButtonList = ({
  blockNames,
  selectedBlockName,
}: {
  blockNames: {
    block_name: string;
  }[];
  selectedBlockName: string;
}) => {
  const convertBlockNameToUrl = (blockName: string) => {
    return blockName.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="w-fit flex flex-row mx-auto gap-8">
      {blockNames &&
        blockNames.map((block) => (
          <Link
            href={`/admin/${convertBlockNameToUrl(block.block_name)}`}
            key={block.block_name}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
              block.block_name === selectedBlockName
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {block.block_name}
          </Link>
        ))}
    </div>
  );
};

export default BlockButtonList;
