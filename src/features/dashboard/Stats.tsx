import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";

import Stat from "./Stat";

interface Booking {
  total_price: number;
}

interface Stay {
  num_nights: number;
}

interface StatsProps {
  bookings: Booking[];
  confirmedStays: Stay[];
  numDays: number;
  cabinCount: number;
}

function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProps) {
  const numBookings = bookings.length;
  const sales = bookings.reduce(
    (acc: number, cur: Booking) => acc + cur.total_price,
    0
  );
  const checkins = confirmedStays.length;
  const occupation =
    numDays > 0 && cabinCount > 0
      ? confirmedStays.reduce(
          (acc: number, cur: Stay) => acc + cur.num_nights,
          0
        ) /
        (numDays * cabinCount)
      : 0;

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />{" "}
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />{" "}
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  );
}

export default Stats;
