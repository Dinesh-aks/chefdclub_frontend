import { ContactHero } from "@/features/website/contact/components/ContactHero";
import { ContactSection } from "@/features/website/contact/components/ContactSection";
import { getWebsiteSocialLinks } from "@/lib/websiteSocialLinks";

export async function ContactPage() {
  const socialLinks = await getWebsiteSocialLinks();

  return (
    <>
      <ContactHero />
      <ContactSection socialLinks={socialLinks} />
    </>
  );
}
