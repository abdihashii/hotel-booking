import { useEffect, useState } from 'react';
import { TUnavailableDates } from '@/types';
import { toZonedTime } from 'date-fns-tz';

const useBookingsForAdmin = (
  blockNames:
    | {
        block_name: string;
      }[]
    | undefined,
  uA: TUnavailableDates | undefined
) => {
  const [unavailableDates, setUnavailableDates] =
    useState<TUnavailableDates | null>(uA ?? null);
  const [selectedBlockName, setSelectedBlockName] = useState<string>('Block A');
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickSelectedBlock = (blockName: string) => {
    setSelectedBlockName(blockName);
  };

  /**
   * Use effect that returns unavailable dates when the selected block name changes
   */
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/unavailable_dates?block_name=${encodeURIComponent(
            selectedBlockName
          )}`
        );

        if (!res.ok) {
          throw new Error('Could not fetch unavailable dates');
        }

        const data: {
          blockName: string;
          unavailableDates: TUnavailableDates;
        } = await res.json();

        if (!data.unavailableDates || data.unavailableDates.length === 0) {
          throw new Error('No unavailable dates found');
        }

        const formattedUnavailableDates = data.unavailableDates.map(
          (booking) => ({
            ...booking,
            from: toZonedTime(new Date(booking.from), 'UTC'),
            to: toZonedTime(new Date(booking.to), 'UTC'),
          })
        );

        setUnavailableDates(formattedUnavailableDates);
      } catch (error) {
        console.error('Failed to fetch unavailable dates:', error);
        setUnavailableDates([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    // Fetch dates if block names are provided
    if (blockNames && blockNames.length > 0) {
      fetchUnavailableDates();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlockName, blockNames]);

  return {
    unavailableDates,
    selectedBlockName,
    handleClickSelectedBlock,
    loading,
  };
};

export default useBookingsForAdmin;
