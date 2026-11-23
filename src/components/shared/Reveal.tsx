"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { fadeInUp } from "@/lib/motion/variants";

interface RevealProps extends React.ComponentProps<typeof m.div> {
  variants?: Variants;
}

/**
 * Animates a section/element into view once, the first time it scrolls
 * into the viewport. Wrap a single block of content per `Reveal` — for a
 * list of items that should animate in sequence, use `StaggerGroup` instead.
 * Respects `prefers-reduced-motion` automatically.
 */
export function Reveal({ variants = fadeInUp, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={shouldReduceMotion ? undefined : variants}
      {...props}
    />
  );
}
