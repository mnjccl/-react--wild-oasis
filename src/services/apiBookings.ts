import supabase from "./supabase";

import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";

interface Filter {
  field: string;
  value: string;
  method?: "eq" | "gte";
}

interface SortBy {
  field: string;
  direction: string;
}

export async function getBookings({
  filter,
  sortBy,
  page,
}: {
  filter?: Filter | null;
  sortBy?: SortBy | null;
  page?: number;
}) {
  let query = supabase
    .from("bookings")
    .select(
      "id, start_date, end_date, num_nights, num_guests, status, total_price, cabins(name), guests(full_name, email)",
      { count: "exact" }
    );

  if (filter && filter.field && filter.value) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking n ot found");
  }

  return data;
}

export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, total_price, extras_price")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(full_name)")
    .gte("start_date", date)
    .lte("start_date", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(full_name, nationality, country_flag)")
    .or(
      `and(status.eq.unconfirmed,start_date.eq.${getToday()}),and(status.eq.checked-in,end_date.eq.${getToday()})`
    )
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export interface UpdateBookingPayload {
  status?: "checked-in" | "checked-out" | "unconfirmed";
  is_paid?: boolean;
  has_breakfast?: boolean;
  extras_price?: number;
  total_price?: number;
}

export async function updateBooking(id: number, obj: UpdateBookingPayload) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
