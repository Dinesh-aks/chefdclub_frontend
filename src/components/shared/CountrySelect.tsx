"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CountryOption {
  value?: string;
  label: string;
}

interface CountrySelectProps {
  value?: string;
  onChange: (value?: string) => void;
  options: CountryOption[];
  iconComponent: React.ComponentType<{ country?: string; label: string }>;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/**
 * The `countrySelectComponent` for react-phone-number-input's `PhoneField`
 * — a searchable country picker built from shadcn's Command + Popover,
 * instead of the package's default plain `<select>` (no search).
 */
export function CountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  name,
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          name={name}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 py-1 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <Icon country={value} label={selected?.label ?? "International"} />
          <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((option) => option.value)
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Icon country={option.value} label={option.label} />
                    <span className="flex-1">{option.label}</span>
                    {option.value === value ? (
                      <CheckIcon className="size-4" aria-hidden="true" />
                    ) : null}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
