"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          success:
            "!border-emerald-200 !bg-emerald-50 !text-emerald-950 [&_[data-description]]:!text-emerald-800/90",
          error:
            "!border-red-200 !bg-red-50 !text-red-950 [&_[data-description]]:!text-red-800/90",
          warning:
            "!border-amber-200 !bg-amber-50 !text-amber-950 [&_[data-description]]:!text-amber-800/90",
          info: "!border-sky-200 !bg-sky-50 !text-sky-950 [&_[data-description]]:!text-sky-800/90",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
