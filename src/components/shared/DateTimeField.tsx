"use client";

import { useId, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEFAULT_HOUR = 19;
const DEFAULT_MINUTE = 0;

interface DateTimeFieldProps {
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  requiredMark?: boolean;
}

export function DateTimeField({
  id: idProp,
  label = "Preferred date & time",
  placeholder = "Select date and time",
  className,
  value: controlledValue,
  onChange,
  requiredMark = false,
}: DateTimeFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const timeInputId = `${id}-time`;
  const [internalValue, setInternalValue] = useState<Date>();
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const setValue = (next: Date | undefined) => {
    if (onChange) {
      onChange(next);
    } else {
      setInternalValue(next);
    }
  };

  function mergeDayWithTime(day: Date, hours: number, minutes: number): Date {
    const next = new Date(day);
    next.setHours(hours, minutes, 0, 0);
    return next;
  }

  function handleDaySelect(day: Date | undefined) {
    if (!day) {
      setValue(undefined);
      return;
    }
    const hours = value?.getHours() ?? DEFAULT_HOUR;
    const minutes = value?.getMinutes() ?? DEFAULT_MINUTE;
    setValue(mergeDayWithTime(day, hours, minutes));
  }

  function handleTimeChange(timeValue: string) {
    if (!timeValue || !value) {
      return;
    }
    const parts = timeValue.split(":");
    if (parts.length < 2) {
      return;
    }
    const hours = Number.parseInt(parts[0] ?? "", 10);
    const minutes = Number.parseInt(parts[1] ?? "", 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }
    setValue(mergeDayWithTime(value, hours, minutes));
  }

  const timeInputValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {requiredMark ? (
          <span className="text-primary" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className="flex h-9 w-full items-center justify-between border-0 border-b border-input bg-transparent py-1 text-base text-foreground outline-none transition-colors focus-visible:border-ring md:text-sm"
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? formatDisplayDateTime(value) : placeholder}
            </span>
            <CalendarIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-row">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDaySelect}
              disabled={{ before: startOfToday() }}
            />
            <div className="flex min-w-[8.5rem] flex-col justify-center gap-2 border-l border-border p-4">
              <Label
                htmlFor={timeInputId}
                className="text-xs tracking-wide text-muted-foreground uppercase"
              >
                Time
              </Label>
              <Input
                id={timeInputId}
                type="time"
                value={timeInputValue}
                onChange={(event) => handleTimeChange(event.target.value)}
                disabled={!value}
                className="border-input bg-background"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatDisplayDateTime(date: Date): string {
  const datePart = date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-SG", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}
