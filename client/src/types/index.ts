export interface Bookings {
  created_at: string;
  check_in_date: string;
  checkout_date: string;
  guest_name: string;
  id: string;
  block_name: string;
}

export interface Blocks {
  block_name: string;
  created_at: string;
  id: string;
  image_alt: string | null;
  image_url: string | null;
  updated_at: string | null;
}
