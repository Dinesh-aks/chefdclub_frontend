import Link from "next/link";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SocialLinkList } from "@/components/website/SocialLinkList";
import { primaryNav, reserveNavItem } from "@/config/nav";
import { siteConfig } from "@/config/site";
import type { WebsiteSocialLink } from "@/lib/websiteSocialLinks";

const linkClassName =
  "flex items-center justify-between rounded-sm py-4 text-sm font-medium tracking-mega uppercase transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none";

export function MobileNav({ socialLinks }: { socialLinks: WebsiteSocialLink[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="tone-ink flex w-full flex-col gap-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <Logo textClassName="text-lg" />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-4">
          <ul className="divide-y divide-border">
            {primaryNav.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <details className="group">
                    <summary className={`${linkClassName} cursor-pointer list-none`}>
                      {item.label}
                      <ChevronDownIcon
                        className="size-4 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <ul className="flex flex-col gap-1 pb-4 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-sm py-2 text-xs tracking-mega text-muted-foreground uppercase transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={item.href} className={linkClassName}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <Button asChild className="mt-6 w-full">
            <Link href={reserveNavItem.href}>{reserveNavItem.label}</Link>
          </Button>
        </nav>

        <div className="border-t border-border px-4 py-5 text-xs text-muted-foreground">
          <p>{siteConfig.address}</p>
          <p className="mt-1">
            {siteConfig.phone} &middot; {siteConfig.email}
          </p>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 tracking-mega uppercase">
            <SocialLinkList links={socialLinks} asItems />
            {siteConfig.legal.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
