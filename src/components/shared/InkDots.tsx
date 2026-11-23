"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InkDotsProps {
  label?: string;
  className?: string;
}

/**
 * Three pulsing dots in the brand red — the site's quiet, inline loading
 * indicator for a grid or panel still waiting on data. Not a full-page
 * splash; see `PageLoader` for that.
 */
export function InkDots({ label, className }: InkDotsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("flex flex-col items-center gap-3.5 py-16", className)}>
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <m.span
            key={index}
            className="size-2 rounded-full bg-primary"
            animate={
              shouldReduceMotion ? undefined : { opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }
            }
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
      {label ? (
        <p className="text-[10px] tracking-mega text-muted-foreground uppercase">{label}</p>
      ) : null}
    </div>
  );
}
