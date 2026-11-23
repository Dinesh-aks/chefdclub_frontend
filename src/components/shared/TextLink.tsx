import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextLinkProps extends React.ComponentProps<typeof Link> {
  /** "underline" for inline text links, "arrow" for standalone CTAs. */
  variant?: "underline" | "arrow";
}

/**
 * The small uppercase tracked text link used throughout the site
 * (e.g. "Explore the menus", "Read the essay", "Reserve a date →").
 * For the solid button CTA, use `components/ui/button` instead.
 */
export function TextLink({
  variant = "underline",
  className,
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm text-xs font-medium tracking-mega text-foreground uppercase underline-offset-8 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        variant === "underline" && "underline decoration-primary",
        className,
      )}
      {...props}
    >
      {children}
      {variant === "arrow" ? (
        <ArrowRightIcon className="size-3.5" aria-hidden="true" />
      ) : null}
    </Link>
  );
}
