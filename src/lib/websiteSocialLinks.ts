import { cache } from "react";
import { fetchSocialLinks, type SocialLinkRecord } from "@/lib/api/socialLinks";

export type WebsiteSocialLink = {
  id: number;
  href: string;
  label: string;
  /** Short line for contact page (e.g. @handle on Instagram). */
  display: string;
};

const ICON_LABELS: [RegExp, string][] = [
  [/instagram/i, "Instagram"],
  [/facebook/i, "Facebook"],
  [/twitter|x-twitter|\bx\b/i, "X"],
  [/youtube/i, "YouTube"],
  [/linkedin/i, "LinkedIn"],
  [/tiktok/i, "TikTok"],
  [/pinterest/i, "Pinterest"],
  [/whatsapp/i, "WhatsApp"],
];

function normalizeSocialHref(link: string): string {
  const trimmed = link.trim();
  if (!trimmed || trimmed === "#") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function labelFromIcon(icon: string): string | undefined {
  for (const [pattern, label] of ICON_LABELS) {
    if (pattern.test(icon)) return label;
  }
  return undefined;
}

function labelFromUrl(href: string): string {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    const base = host.split(".")[0];
    if (base) {
      return base.charAt(0).toUpperCase() + base.slice(1);
    }
  } catch {
    // ignore
  }
  return "Social";
}

function displayFromUrl(href: string, label: string): string {
  try {
    const url = new URL(href);
    const path = url.pathname.replace(/\/+$/, "");
    const segments = path.split("/").filter(Boolean);
    if (label === "Instagram" && segments.length > 0) {
      const handle = segments.at(-1);
      if (handle) return handle.startsWith("@") ? handle : `@${handle}`;
    }
    if (segments.length > 0) {
      const last = segments.at(-1);
      if (last && last.length <= 32) return last.startsWith("@") ? last : `@${last}`;
    }
  } catch {
    // ignore
  }
  return label;
}

export function mapSocialLinkForWebsite(record: SocialLinkRecord): WebsiteSocialLink | null {
  const href = normalizeSocialHref(record.link);
  if (!href) return null;
  const label = labelFromIcon(record.icon) ?? labelFromUrl(href);
  return {
    id: record.id,
    href,
    label,
    display: displayFromUrl(href, label),
  };
}

export const getWebsiteSocialLinks = cache(async (): Promise<WebsiteSocialLink[]> => {
  try {
    const response = await fetchSocialLinks();
    return response.data
      .map(mapSocialLinkForWebsite)
      .filter((item): item is WebsiteSocialLink => item !== null);
  } catch {
    return [];
  }
});
