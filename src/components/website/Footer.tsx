import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { SocialLinkList } from "@/components/website/SocialLinkList";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/nav";
import { getWebsiteSocialLinks } from "@/lib/websiteSocialLinks";

export async function Footer() {
  const socialLinks = await getWebsiteSocialLinks();
  return (
    <footer className="tone-ink border-t border-border bg-background text-foreground">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:py-20">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-xs tracking-mega text-muted-foreground uppercase">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {group.items.map((item) => (
                <li key={item.label + item.href}>
                  <Link
                    href={item.href}
                    className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-xs tracking-mega text-muted-foreground uppercase">
            Visit
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p>{siteConfig.address}</p>
            <p>{siteConfig.phone}</p>
            <p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="rounded-sm transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {siteConfig.email}
              </a>
            </p>
            <p>{siteConfig.hours}</p>
          </address>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}, {siteConfig.location}.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 tracking-mega uppercase">
            <SocialLinkList links={socialLinks} asItems linkClassName="text-inherit" />
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
        </Container>
      </div>
    </footer>
  );
}
