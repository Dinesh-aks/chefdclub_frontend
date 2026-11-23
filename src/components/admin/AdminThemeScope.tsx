"use client";

import { useEffect } from "react";

/**
 * Radix popovers, dropdowns, selects and dialogs render in a portal on <body>,
 * outside the `.admin-theme` wrapper. Mirror the theme classes onto <body>
 * while the admin is mounted so those overlays pick up the admin palette and
 * font too, then remove them when leaving the admin.
 */
export function AdminThemeScope({ className }: { className: string }) {
  useEffect(() => {
    const classes = className.split(" ").filter(Boolean);
    document.body.classList.add(...classes);
    return () => document.body.classList.remove(...classes);
  }, [className]);

  return null;
}
