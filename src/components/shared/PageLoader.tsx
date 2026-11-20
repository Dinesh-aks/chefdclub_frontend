"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InkDots } from "@/components/shared/InkDots";

const MIN_VISIBLE_MS = 1400;

/**
 * A one-time branded splash shown while the site's first paint settles.
 * Lives in the root layout, so it mounts once per full page load — not on
 * client-side route transitions, which stay instant as normal. Skipped on
 * /admin routes, which are an internal tool rather than the marketing site.
 */
export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), shouldReduceMotion ? 0 : MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="page-loader"
          className="tone-ink fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background/40 text-foreground backdrop-blur-md"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.span
            className="font-serif text-4xl sm:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Chef <em className="text-primary italic">&rsquo;d</em> Club
          </motion.span>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <InkDots className="py-0" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
