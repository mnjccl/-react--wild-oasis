/* eslint-disable @typescript-eslint/no-explicit-any */
type BookingStatus = "unconfirmed" | "checked-in" | "checked-out";

export interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  num_nights: number;
  num_guests: number;
  total_price: number;
  status: BookingStatus;
  guests: Record<string, any>;
  cabins: Record<string, any>;
}
