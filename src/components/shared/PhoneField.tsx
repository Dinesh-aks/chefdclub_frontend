"use client";

import { useId, useState } from "react";
import PhoneInputBase, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountrySelect } from "@/components/shared/CountrySelect";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PhoneFieldProps {
  id?: string;
  label?: string;
  name?: string;
  defaultCountry?: React.ComponentProps<typeof PhoneInputBase>["defaultCountry"];
  placeholder?: string;
  className?: string;
  value?: Value;
  onChange?: (value: Value) => void;
  requiredMark?: boolean;
}

export function PhoneField({
  id: idProp,
  label = "Phone / WhatsApp",
  name = "phone",
  defaultCountry = "SG",
  placeholder,
  className,
  value: controlledValue,
  onChange,
  requiredMark = false,
}: PhoneFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [internalValue, setInternalValue] = useState<Value>();
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = (next: Value) => {
    if (onChange) {
      onChange(next);
    } else {
      setInternalValue(next);
    }
  };

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
      <PhoneInputBase
        id={id}
        name={name}
        className="chefdclub-phone-input"
        international
        defaultCountry={defaultCountry}
        placeholder={placeholder}
        value={value}
        onChange={setValue}
        countrySelectComponent={CountrySelect}
      />
    </div>
  );
}
