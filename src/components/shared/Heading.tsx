import { cn } from "@/lib/utils";

type HeadingSize = "display" | "section" | "subsection";

interface HeadingProps extends Omit<React.ComponentProps<"h2">, "children"> {
  as?: "h1" | "h2" | "h3";
  /** Small tracked label above the heading, e.g. "CURATED DINING · SINGAPORE". */
  eyebrow?: string;
  size?: HeadingSize;
  align?: "left" | "center";
  children: React.ReactNode;
}

const sizeClassName: Record<HeadingSize, string> = {
  display: "text-5xl sm:text-6xl lg:text-7xl",
  section: "text-3xl sm:text-4xl lg:text-5xl",
  subsection: "text-2xl sm:text-3xl",
};

/**
 * The eyebrow + serif headline pattern used at the top of every section.
 * For the italic/accent phrase seen in the reference designs, wrap the
 * relevant words in `<em>` (or `<em className="text-primary">` for the red
 * accent) inside `children` — this component only owns layout and sizing.
 */
export function Heading({
  as: Tag = "h2",
  eyebrow,
  size = "section",
  align = "left",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow ? (
        <div
          className={cn(
            "mb-3 flex items-center gap-3 text-xs uppercase tracking-mega text-muted-foreground",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
          {eyebrow}
        </div>
      ) : null}
      <Tag
        className={cn(
          "text-balance font-serif leading-[1.1] font-normal",
          sizeClassName[size],
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    </div>
  );
}
