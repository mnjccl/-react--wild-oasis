import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

import Heading from "../../ui/Heading";
import useDarkMode from "../../hooks/useDarkMode";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

interface Booking {
  created_at: string;
  total_price: number;
  extras_price: number;
}

interface SalesChartProps {
  bookings: Booking[];
  numDays: number;
}

function SalesChart({ bookings, numDays }: SalesChartProps) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, curr) => acc + curr.total_price, 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, curr) => acc + curr.extras_price, 0),
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales
        {allDates.at(0)
          ? ` from ${format(allDates.at(0) as Date, "MMM dd yyyy")}`
          : ""}
        {allDates.at(-1)
          ? ` to ${format(allDates.at(-1) as Date, "MMM dd yyyy")}`
          : ""}
      </Heading>

      <ResponsiveContainer height={250} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
