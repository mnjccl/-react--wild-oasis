import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { PAGE_SIZE } from "../../utils/constants";
import { Booking } from "./BookingTypes";

import { getBookings } from "../../services/apiBookings";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  //filter
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  //sort
  const sortByRaw = searchParams.get("sortBy") || "start_date-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  //pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //query
  const {
    isLoading,
    data = { data: [], count: 0 },
    error,
  } = useQuery<{ data: Booking[]; count: number | null }>({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  //pre-fetching
  const count = data.count ?? 0;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, error, bookings: data.data, count: data.count };
}
