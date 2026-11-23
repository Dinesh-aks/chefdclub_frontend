import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants for the site. Keep motion subtle — this is
 * a premium restaurant site, not a product demo. Use these instead of
 * inventing new transitions per component. See docs/ARCHITECTURE.md ("Animation
 * conventions") for when to reach for each one.
 */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Apply to a parent; give each direct motion child `variants={fadeInUp}`. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};
