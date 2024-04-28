'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Blocks } from '@/types';
import { Database } from '@/types/database.types';

import useBookings from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import AvailabilityCalendar from '@/components/Calendar/AvailabilityCalendar';
import { Loader2 } from 'lucide-react';

const startOfCurrentMonth = new Date(new Date().setDate(1));

const AdminPage = () => {
  const supabase = createClientComponentClient<Database>();

  const [blocks, setBlocks] = useState<Array<Blocks>>([]);
  const [selectedBlock, setSelectedBlock] = useState<Blocks | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    unavailableDates,
    handleGetUnavailableDates,
    isLoading: bookingsLoading,
  } = useBookings({
    blockName: selectedBlock?.block_name ?? '',
  });

  const fetchAllBlocks = async (): Promise<Blocks[]> => {
    try {
      const { data: blocks, error } = await supabase
        .from('blocks')
        .select('*')
        .order('block_name', { ascending: true });

      if (error) {
        console.error(error);
        throw new Error('Failed to fetch blocks');
      }

      return blocks;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  useEffect(() => {
    const initData = async () => {
      const allBlocks = await fetchAllBlocks();

      if (allBlocks.length > 0) {
        setBlocks(allBlocks);
        setSelectedBlock(allBlocks[0]);
      }
      setIsLoading(false);
    };

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBlock) {
      handleGetUnavailableDates();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlock]);

  if (isLoading) {
    // Handle overall loading state
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100">
        Admin Page
      </h1>

      <div className="p-8 w-full border border-black dark:border-white space-y-12 min-h-[521px]">
        <div className="flex flex-row gap-8 w-fit mx-auto">
          {blocks.map((block) => {
            return (
              <Button
                key={block.id}
                className={`text-xl font-semibold
                  ${
                    selectedBlock?.id === block.id
                      ? 'bg-green-700 hover:bg-green-800 text-white'
                      : ''
                  }
                `}
                onClick={() => setSelectedBlock(block)}
              >
                {block.block_name}
              </Button>
            );
          })}
        </div>

        <AvailabilityCalendar
          className="w-fit mx-auto"
          unavailableDates={unavailableDates}
          startOfCurrentMonth={startOfCurrentMonth}
          numberOfMonths={3}
        />
      </div>
    </section>
  );
};

export default AdminPage;
