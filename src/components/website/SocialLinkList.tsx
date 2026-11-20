import type { WebsiteSocialLink } from "@/lib/websiteSocialLinks";
import { cn } from "@/lib/utils";

type SocialLinkListProps = {
  links: WebsiteSocialLink[];
  className?: string;
  /** Footer/mobile: platform name. Contact: @handle-style display. */
  variant?: "label" | "display";
  listClassName?: string;
  linkClassName?: string;
  /** Render `<li>` items only (for merging into a parent `<ul>`). */
  asItems?: boolean;
};

export function SocialLinkList({
  links,
  className,
  variant = "label",
  listClassName,
  linkClassName,
  asItems = false,
}: SocialLinkListProps) {
  if (links.length === 0) return null;

  const items = links.map((item) => (
    <li key={item.id}>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
          linkClassName,
        )}
      >
        {variant === "display" ? item.display : item.label}
      </a>
    </li>
  ));

  if (asItems) {
    return <>{items}</>;
  }

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 tracking-mega uppercase",
        listClassName,
        className,
      )}
    >
      {items}
    </ul>
  );
}
