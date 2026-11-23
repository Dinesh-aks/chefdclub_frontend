"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatIsoDate, parseIsoDate } from "@/components/shared/DateField";
import { cn } from "@/lib/utils";

interface AdminDateInputProps {
  id?: string;
  /** Stored value, `yyyy-mm-dd` (or empty). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Shows the date as `dd-mm-yyyy` regardless of browser locale, while the value stays `yyyy-mm-dd`. */
function displayDate(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

export function AdminDateInput({
  id,
  value,
  onChange,
  placeholder = "dd-mm-yyyy",
  className,
}: AdminDateInputProps) {
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          data-slot="input"
          className={cn(
            "flex h-9 w-full items-center justify-between py-1 text-left text-base md:text-sm",
            className,
          )}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value ? displayDate(value) : placeholder}
          </span>
          <CalendarIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={new Date(2000, 0)}
          endMonth={new Date(new Date().getFullYear() + 2, 11)}
          defaultMonth={selected}
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onChange(formatIsoDate(date));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
