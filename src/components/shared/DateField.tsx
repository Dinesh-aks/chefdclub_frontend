"use client";

import { useId, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateFieldProps {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  /** When true (default), dates before today cannot be selected — for public booking forms. */
  disablePast?: boolean;
}

export function DateField({
  id: idProp,
  label = "Preferred date",
  name = "date",
  placeholder = "Select a date",
  className,
  triggerClassName,
  value: controlledValue,
  onChange,
  disablePast = true,
}: DateFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [internalDate, setInternalDate] = useState<Date>();
  const date = controlledValue !== undefined ? controlledValue : internalDate;
  const setDate = (next: Date | undefined) => {
    if (onChange) {
      onChange(next);
    } else {
      setInternalDate(next);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={date ? formatIsoDate(date) : ""} readOnly />
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className={cn(
              "flex h-9 w-full items-center justify-between border-0 border-b border-input bg-transparent py-1 text-base text-foreground outline-none transition-colors focus-visible:border-ring md:text-sm",
              triggerClassName,
            )}
          >
            <span className={cn(!date && "text-muted-foreground")}>
              {date
                ? date.toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : placeholder}
            </span>
            <CalendarIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disablePast ? { before: startOfToday() } : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(value: string): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
