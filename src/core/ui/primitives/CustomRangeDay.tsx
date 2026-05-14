import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";

export function CustomRangeDay(
  day: Dayjs,
  _value: Dayjs[],
  DayComponentProps: PickersDayProps<Dayjs>,
  start: Dayjs,
  end: Dayjs
) {
  const isStart = day.isSame(start, "day");
  const isEnd = day.isSame(end, "day");
  const isBetween = day.isAfter(start, "day") && day.isBefore(end, "day");

  return (
    <PickersDay
      {...DayComponentProps}
      day={day}
      sx={{
        ...(isStart && {
          backgroundColor: "#1976d2",
          color: "white",
          borderRadius: "50% 0 0 50%",
        }),
        ...(isEnd && {
          backgroundColor: "#1976d2",
          color: "white",
          borderRadius: "0 50% 50% 0",
        }),
        ...(isBetween && {
          backgroundColor: "#1976d2",
          color: "white",
          borderRadius: 0,
        }),
      }}
    />
  );
}

