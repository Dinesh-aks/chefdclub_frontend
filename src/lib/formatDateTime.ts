/** Restaurant operates in Singapore — admin timestamps always display in this zone. */
export const BUSINESS_TIME_ZONE = "Asia/Singapore";
export const BUSINESS_LOCALE = "en-SG";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: BUSINESS_TIME_ZONE,
};

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: BUSINESS_TIME_ZONE,
};

function toDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatBusinessDate(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  const date = toDate(value);
  if (!date) return "—";
  return date.toLocaleDateString(BUSINESS_LOCALE, DATE_FORMAT);
}

export function formatBusinessTime(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "";
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleTimeString(BUSINESS_LOCALE, TIME_FORMAT);
}

export function formatBusinessDateTime(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  const date = toDate(value);
  if (!date) return "—";
  const day = formatBusinessDate(date);
  const time = formatBusinessTime(date);
  return time ? `${day}, ${time}` : day;
}
