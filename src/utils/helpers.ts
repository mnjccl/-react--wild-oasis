import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns/fp";

// We want to make this function work for both Date objects and strings (which come from Supabase)
const parseDate = (date: string | Date): Date =>
  typeof date === "string" ? parseISO(date) : date;

export const subtractDates = (
  date1: string | Date,
  date2: string | Date
): number => Math.abs(differenceInDays(parseDate(date1), parseDate(date2)));

export const formatDistanceFromNow = (date: string | Date): string =>
  formatDistance(parseDate(date), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
interface GetTodayOptions {
  end?: boolean;
}

export const getToday = function (options: GetTodayOptions = {}) {
  const today = new Date();
  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );
