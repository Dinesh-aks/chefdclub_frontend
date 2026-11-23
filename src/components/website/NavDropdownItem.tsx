"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/nav";

interface NavDropdownItemProps {
  item: NavItem;
  linkClassName: string;
  underlineClassName: string;
}

const CLOSE_DELAY_MS = 150;

/**
 * A primary-nav item with a hover-opened dropdown (e.g. "Menus"). Kept as
 * its own Client Component — only this leaf needs the open-state/hover
 * logic, so `Navigation` itself stays a Server Component.
 *
 * Closing is delayed (hover-intent) rather than instant: the trigger and
 * the dropdown content are separate DOM nodes with a small gap between
 * them, so an immediate close-on-mouseleave flickers while the cursor
 * crosses that gap.
 */
export function NavDropdownItem({
  item,
  linkClassName,
  underlineClassName,
}: NavDropdownItemProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleOpen = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  };

  const handleClose = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        className={cn(
          linkClassName,
          "inline-flex items-center outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:text-foreground",
        )}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        {item.label}
        {/* Underline stays drawn while the dropdown is open, like a hovered link. */}
        <span
          className={cn(underlineClassName, open && "scale-x-100")}
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={16}
        className="tone-ink min-w-[17rem] rounded-none border-foreground/15 bg-card py-3 shadow-none"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        {item.children?.map((child) => (
          <DropdownMenuItem
            key={child.href}
            asChild
            className="rounded-none px-6 py-3.5 text-foreground/70 focus:bg-foreground/10 focus:text-foreground"
          >
            <Link href={child.href} className="text-xs tracking-mega uppercase">
              {child.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
