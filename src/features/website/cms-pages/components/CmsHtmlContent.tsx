import { cn } from "cn";

interface CmsHtmlContentProps {
  html: string;
  className?: string;
}

/** Renders trusted CMS HTML from the backend (admin-authored). */
export function CmsHtmlContent({ html, className }: CmsHtmlContentProps) {
  if (!html.trim()) {
    return null;
  }

  return (
    <div
      className={cn(
        "cms-html text-base leading-relaxed text-muted-foreground",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground",
        "[&_p]:mb-4 [&_li]:mb-2 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-xl [&_blockquote]:leading-snug [&_blockquote]:text-foreground [&_blockquote]:italic [&_blockquote_p]:mb-0 [&_blockquote_p]:text-xl",
        "[&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
