import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  date,
} from 'drizzle-orm/pg-core';

export const blocks = pgTable('blocks', {
  id: uuid('id').primaryKey(),
  block_name: text('block_name').primaryKey().unique(),
  image_url: text('image_url'),
  image_alt_text: text('image_alt_text'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').notNull(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey(),
  guest_name: text('guest_name').notNull(),
  block_name: text('block_name')
    .references(() => blocks.block_name)
    .notNull(),
  num_guests: integer('num_guests').notNull(),
  check_in_date: date('check_in_date').notNull(),
  check_out_date: date('check_out_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
