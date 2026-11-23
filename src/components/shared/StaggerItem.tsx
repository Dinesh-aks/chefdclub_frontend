"use client";

import { m, type Variants } from "framer-motion";
import { fadeInUp } from "@/lib/motion/variants";

interface StaggerItemProps extends React.ComponentProps<typeof m.div> {
  variants?: Variants;
}

/**
 * One item inside a `StaggerGroup`. Kept as its own tiny Client Component so
 * the surrounding section (headings, copy, links) can stay a Server
 * Component — only this leaf needs "use client" for Framer Motion.
 */
export function StaggerItem({ variants = fadeInUp, ...props }: StaggerItemProps) {
  return <m.div variants={variants} {...props} />;
}
