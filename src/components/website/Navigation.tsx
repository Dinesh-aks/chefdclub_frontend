import Link from "next/link";
import { NavDropdownItem } from "@/components/website/NavDropdownItem";
import { cn } from "@/lib/utils";
import { primaryNav } from "@/config/nav";

const linkClassName =
  "group relative rounded-sm text-xs font-normal tracking-mega text-foreground/80 uppercase transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none";

const underlineClassName =
  "absolute inset-x-0 -bottom-3 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100";

export function Navigation({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Primary"
      className={cn("hidden items-center gap-8 lg:flex", className)}
    >
      {primaryNav.map((item) =>
        item.children ? (
          <NavDropdownItem
            key={item.href}
            item={item}
            linkClassName={linkClassName}
            underlineClassName={underlineClassName}
          />
        ) : (
          <Link key={item.href} href={item.href} className={linkClassName}>
            {item.label}
            <span className={underlineClassName} aria-hidden="true" />
          </Link>
        ),
      )}
    </nav>
  );
}
