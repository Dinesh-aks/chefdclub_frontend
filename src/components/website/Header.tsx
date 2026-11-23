import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Navigation } from "@/components/website/Navigation";
import { MobileNav } from "@/components/website/MobileNav";
import { siteConfig } from "@/config/site";
import { reserveNavItem } from "@/config/nav";
import { getWebsiteSocialLinks } from "@/lib/websiteSocialLinks";

export async function Header() {
  const socialLinks = await getWebsiteSocialLinks();
  return (
    <header className="tone-ink sticky top-0 z-50 bg-background text-foreground">
      {/* Utility bar: hidden on small screens to keep the mobile header compact. */}
      <div className="hidden border-b border-border lg:block">
        <Container className="flex items-center justify-between py-2 text-[11px] tracking-mega text-muted-foreground uppercase">
          <ul className="flex items-center gap-6">
            {siteConfig.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          <p>
            {siteConfig.hours} &middot; {siteConfig.phone}
          </p>
        </Container>
      </div>

      <div className="border-b border-border">
        <Container className="flex items-center justify-between gap-4 py-4">
          <Logo size="lg" />
          <Navigation />
          <div className="flex items-center gap-2">
            <Button asChild size="lg" className="hidden h-11 px-6 sm:inline-flex">
              <Link href={reserveNavItem.href}>{reserveNavItem.label}</Link>
            </Button>
            <MobileNav socialLinks={socialLinks} />
          </div>
        </Container>
      </div>
    </header>
  );
}
