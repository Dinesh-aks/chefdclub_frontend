import { cn } from "cn";
import "./cms-html.css";

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
      className={cn("cms-html", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}