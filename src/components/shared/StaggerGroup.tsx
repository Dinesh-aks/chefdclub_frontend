"use client";

import { m, useReducedMotion } from "framer-motion";
import { staggerChildren } from "@/lib/motion/variants";

/**
 * Wraps a list of items (e.g. a gallery grid, a feature row) so its direct
 * motion children animate in one after another. Give each child
 * `variants={fadeInUp}` (or another shared variant) — do not add its own
 * `initial`/`whileInView`, that's owned by this wrapper.
 */
export function StaggerGroup(props: React.ComponentProps<typeof m.div>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={shouldReduceMotion ? undefined : staggerChildren}
      {...props}
    />
  );
}
