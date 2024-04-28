export type TBlock = {
  id: string;
  block_name: string;
  image_url: string | null;
  image_alt_text: string | null;
  created_at: Date;
  updated_at: Date;
};

export type TUnavailableDates = {
  id: string;
  guestName: string;
  from: Date;
  to: Date;
  numGuests: number;
}[];
