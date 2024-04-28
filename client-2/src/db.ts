import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { blocks, bookings } from './schema';
import { asc, eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;

// Initialize the PostgreSQL client with the connection string from environment
// variables.
export const client = postgres(connectionString);

// Initialize drizzle with the PostgreSQL client.
export const db = drizzle(client);

/**
 * Retrieves booking data for a specified block name.
 * @param blockName The name of the block for which bookings are to be retrieved.
 * @returns A list of booking objects each containing the id, guest name,
 * check-in and check-out dates, and the number of guests.
 * @throws Will throw an error if no bookings are found for the provided block name.
 */
export async function getBookingByBlockName(blockName: string) {
  try {
    const bookingsForBlockName = await db
      .select({
        id: bookings.id,
        guestName: bookings.guest_name,
        checkInDate: bookings.check_in_date,
        checkOutDate: bookings.check_out_date,
        numGuests: bookings.num_guests,
      })
      .from(bookings)
      .where(eq(bookings.block_name, blockName))
      .orderBy(asc(bookings.check_in_date));

    if (bookingsForBlockName.length === 0) {
      return [];
    }

    return bookingsForBlockName;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Determines unavailable dates for a specified block based on existing bookings.
 * @param blockName The name of the block to check for availability.
 * @returns A list of objects detailing the unavailable periods, including
 * booking id, guest name, start and end dates, and the number of guests.
 * @throws Will throw an error if no bookings exist for the provided block name.
 */
export async function getUnavailableDatesForBlock(blockName: string) {
  try {
    const bookingsForBlockName = await getBookingByBlockName(blockName);

    if (!bookingsForBlockName) {
      throw new Error(`No bookings found for block name: ${blockName}`);
    }

    const unavailableDates = bookingsForBlockName.map((booking) => {
      const id = booking.id;
      const guestName = booking.guestName;
      const numGuests = booking.numGuests;

      // Ensure that dates are parsed as local time
      const from = new Date(booking.checkInDate);
      const to = new Date(booking.checkOutDate);

      // Adjust dates to treat as local time
      from.setMinutes(from.getMinutes() - from.getTimezoneOffset());
      to.setMinutes(to.getMinutes() - to.getTimezoneOffset());

      return {
        id,
        guestName,
        from,
        to,
        numGuests,
      };
    });

    return unavailableDates;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Fetches data of a specific block by name.
 * @param blockName The name of the block to retrieve data for.
 * @returns An object containing the block's ID, name, image URL, and image
 * alt text.
 * @throws Will throw an error if no data is found for the given block name.
 */
export async function getBlockData(blockName: string) {
  try {
    const blockData = await db
      .select({
        id: blocks.id,
        block_name: blocks.block_name,
        image_url: blocks.image_url,
        image_alt: blocks.image_alt_text,
      })
      .from(blocks)
      .where(eq(blocks.block_name, blockName));

    if (!blockData || blockData.length === 0) {
      throw new Error(`No block data found for block name: ${blockName}`);
    }

    return blockData[0];
  } catch (err) {
    console.error(err);
  }
}

/**
 * Retrieves the names of all blocks in the database.
 * @returns A list of objects each containing the name of a block.
 * @throws Will throw an error if unable to retrieve block names.
 */
export async function getAllBlockNames() {
  try {
    const allBlocks = await db
      .select({
        block_name: blocks.block_name,
      })
      .from(blocks)
      .orderBy(asc(blocks.block_name));

    return allBlocks;
  } catch (err) {
    console.error(err);
  }
}

export async function bookABlock(blockData: {
  name: string;
  blockName: string;
  dateRange: {
    from: string;
    to: string;
  };
  guests: number;
}) {
  try {
    const bookingData = {
      id: crypto.randomUUID(),
      guest_name: blockData.name,
      block_name: blockData.blockName,
      num_guests: blockData.guests,
      check_in_date: blockData.dateRange.from,
      check_out_date: blockData.dateRange.to,
    };

    return await db.insert(bookings).values(bookingData).returning({
      guestName: bookings.guest_name,
      blockName: bookings.block_name,
      checkInDate: bookings.check_in_date,
      checkOutDate: bookings.check_out_date,
      numGuests: bookings.num_guests,
    });
  } catch (err) {
    console.error(err);
  }
}
