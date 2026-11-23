import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { ContactForm } from "@/features/website/contact/components/ContactForm";
import { siteConfig } from "@/config/site";
import type { WebsiteSocialLink } from "@/lib/websiteSocialLinks";

export function ContactSection({ socialLinks }: { socialLinks: WebsiteSocialLink[] }) {
  return (
    <Section tone="default" padding="afterHero">
      <div className="grid gap-16 lg:grid-cols-2">
        <Reveal className="space-y-6 divide-y divide-border">
          <div className="pb-6">
            <p className="text-xs tracking-mega text-muted-foreground uppercase">
              Address
            </p>
            <p className="mt-2 font-serif text-lg">{siteConfig.address}</p>
          </div>
          <div className="pt-6 pb-6">
            <p className="text-xs tracking-mega text-muted-foreground uppercase">
              Phone / WhatsApp
            </p>
            <p className="mt-2 font-serif text-lg">{siteConfig.phone}</p>
          </div>
          <div className="pt-6 pb-6">
            <p className="text-xs tracking-mega text-muted-foreground uppercase">Email</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-2 block font-serif text-lg transition-colors hover:text-primary"
            >
              {siteConfig.email}
            </a>
          </div>
          <div className="pt-6 pb-6">
            <p className="text-xs tracking-mega text-muted-foreground uppercase">Social</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 font-serif text-lg normal-case tracking-normal">
              {socialLinks.map((item, index) => (
                <span key={item.id} className="flex items-center gap-x-3">
                  {index > 0 ? (
                    <span className="text-primary" aria-hidden="true">
                      &middot;
                    </span>
                  ) : null}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {item.display}
                  </a>
                </span>
              ))}
            </p>
          </div>

          <div className="pt-6">
            <div className="overflow-hidden rounded-md border border-border">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`}
                title={`Map showing ${siteConfig.address}`}
                className="h-[450px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
