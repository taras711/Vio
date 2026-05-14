import dayjs from "dayjs";

export function formatDateTime(timestamp: number | string | Date) {
  return dayjs(timestamp).format("D. M. YYYY HH:mm");
}