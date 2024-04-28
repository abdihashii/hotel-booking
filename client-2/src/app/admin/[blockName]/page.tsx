import AvailabilityCalendar from '@/components/Admin/AvailabilityCalendar';
import { getAllBlockNames, getUnavailableDatesForBlock } from '@/db';
import { normalizeBlockName } from '@/lib/utils';

export default async function AdminPageForBlockName({
  params,
}: {
  params: {
    blockName: string;
  };
}) {
  const currentMonth = new Date();

  const normalizedBlockName = normalizeBlockName(params.blockName);

  const unavailableDates = await getUnavailableDatesForBlock(
    normalizedBlockName
  );
  const allBlockNames = await getAllBlockNames();

  return (
    <AvailabilityCalendar
      blockNames={allBlockNames}
      currentMonth={currentMonth}
      unavailableDates={unavailableDates}
      initialBlockName={normalizedBlockName}
    />
  );
}
