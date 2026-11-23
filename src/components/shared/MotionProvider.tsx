"use client";

import { domAnimation, LazyMotion } from "framer-motion";

/**
 * Loads framer-motion's animation features once, on demand, so components can use the small `m`
 * element instead of the full `motion` bundle (much less JavaScript on every page).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
