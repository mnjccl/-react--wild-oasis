import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

async function deleteGuests() {
  const { error } = await supabase.from("guests").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabins").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) console.log(error.message);
}

async function createBookings() {
  const { data: guestsIds, error: guestsError } = await supabase
    .from("guests")
    .select("id")
    .order("id");

  if (guestsError || !guestsIds) {
    console.log(guestsError?.message || "Failed to fetch guest IDs");
    return;
  }

  const allGuestIds = guestsIds.map((guest) => guest.id);

  const { data: cabinsIds, error: cabinsError } = await supabase
    .from("cabins")
    .select("id")
    .order("id");

  if (cabinsError || !cabinsIds) {
    console.log(cabinsError?.message || "Failed to fetch cabin IDs");
    return;
  }

  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  const finalBookings = bookings
    .map((booking) => {
      const cabin = cabins.at(booking.cabin_id - 1);

      if (!cabin) {
        console.log(`Cabin with ID ${booking.cabin_id} not found.`);
        return null;
      }

      const num_nights = subtractDates(booking.end_date, booking.start_date);
      const cabin_price = num_nights * (cabin.regular_price - cabin.discount);
      const extras_price = booking.has_breakfast
        ? num_nights * 15 * booking.num_guests
        : 0;
      const total_price = cabin_price + extras_price;

      let status;
      if (
        isPast(new Date(booking.end_date)) &&
        !isToday(new Date(booking.end_date))
      )
        status = "checked-out";
      if (
        isFuture(new Date(booking.start_date)) ||
        isToday(new Date(booking.start_date))
      )
        status = "unconfirmed";
      if (
        (isFuture(new Date(booking.end_date)) ||
          isToday(new Date(booking.end_date))) &&
        isPast(new Date(booking.start_date)) &&
        !isToday(new Date(booking.start_date))
      )
        status = "checked-in";

      return {
        ...booking,
        num_nights,
        cabin_price,
        extras_price,
        total_price,
        guest_id: allGuestIds.at(booking.guest_id - 1),
        cabin_id: allCabinIds.at(booking.cabin_id - 1),
        status,
      };
    })
    .filter(Boolean);

  console.log(finalBookings);

  const { error } = await supabase.from("bookings").insert(finalBookings);
  if (error) console.log(error.message);
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
