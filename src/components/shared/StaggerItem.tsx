"use client";

import { motion, type Variants } from "framer-motion";
import { fadeInUp } from "@/lib/motion/variants";

interface StaggerItemProps extends React.ComponentProps<typeof motion.div> {
  variants?: Variants;
}

/**
 * One item inside a `StaggerGroup`. Kept as its own tiny Client Component so
 * the surrounding section (headings, copy, links) can stay a Server
 * Component — only this leaf needs "use client" for Framer Motion.
 */
export function StaggerItem({ variants = fadeInUp, ...props }: StaggerItemProps) {
  return <motion.div variants={variants} {...props} />;
}
