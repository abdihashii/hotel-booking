'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const BlockButtonList = ({
  blockNames,
  selectedBlockName,
  handleChangeSelectedBlockName,
}: {
  blockNames: {
    block_name: string;
  }[];
  selectedBlockName: string;
  handleChangeSelectedBlockName: (blockName: string) => void;
}) => {
  return (
    <div className="w-fit flex flex-row mx-auto gap-8">
      {blockNames &&
        blockNames.map((block) => (
          <Button
            key={block.block_name}
            className={`block-button ${
              block.block_name === selectedBlockName
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : ''
            }`}
            onClick={() => handleChangeSelectedBlockName(block.block_name)}
          >
            {block.block_name}
          </Button>
        ))}
    </div>
  );
};

export default BlockButtonList;
