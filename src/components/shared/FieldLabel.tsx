import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FieldLabelProps = {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
};

export function FieldLabel({ htmlFor, required, children }: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="text-primary" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </Label>
  );
}
