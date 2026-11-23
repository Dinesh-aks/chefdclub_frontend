import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const LOGO_SRC = "/images/brand/chefdclub-logo.png";

interface LogoProps {
  className?: string;
  /** Legacy prop — maps to mark height when `size` is omitted. */
  textClassName?: string;
  /** Destination when the logo is clicked. Defaults to the public homepage. */
  href?: string;
  /** Hide the location beside the wordmark, for layouts that place it elsewhere (e.g. the admin sidebar). */
  hideLocation?: boolean;
  /** Artwork is white; use `false` on light backgrounds (admin sidebar). */
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
}

function markHeightClass(textClassName: string, size: LogoProps["size"]): string {
  if (size === "sm") return "h-10";
  if (size === "lg") return "h-16";
  if (size === "md") return "h-12";
  if (textClassName.includes("lg") && !textClassName.includes("2xl")) return "h-10";
  if (textClassName.includes("22px")) return "h-10";
  return "h-14";
}

/** Brand mark for header, footer, admin shell, and login. */
export function Logo({
  className,
  textClassName = "text-2xl",
  href = "/",
  hideLocation = false,
  onDark = true,
  size,
}: LogoProps) {
  const heightClass = markHeightClass(textClassName, size);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-end gap-1.5 leading-none rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt={siteConfig.name}
        width={140}
        height={100}
        className={cn("w-auto shrink-0 object-contain object-left", heightClass, !onDark && "brightness-0")}
        priority
      />
      {hideLocation ? null : (
        <span className="mb-0.5 shrink-0 text-[10px] tracking-mega text-muted-foreground uppercase">
          {siteConfig.location}
        </span>
      )}
    </Link>
  );
}

/** Square mark for collapsed admin sidebar. */
export function LogoMark({
  className,
  href = "/",
  onDark = false,
  size = "sm",
}: {
  className?: string;
  href?: string;
  onDark?: boolean;
  size?: "xs" | "sm";
}) {
  const heightClass = size === "xs" ? "h-6" : "h-8";

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} admin`}
      className={cn(
        "inline-flex items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={48}
        height={48}
        className={cn("w-auto object-contain", heightClass, !onDark && "brightness-0")}
      />
    </Link>
  );
}
