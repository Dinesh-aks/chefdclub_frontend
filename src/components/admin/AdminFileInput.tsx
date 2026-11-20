"use client";

import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type RefObject } from "react";
import Image from "next/image";
import { ImagePlusIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AdminFileInputProps {
  id: string;
  /** Parents read the chosen file from `inputRef.current.files`, same as with a plain file input. */
  inputRef: RefObject<HTMLInputElement | null>;
  accept?: string;
  /** Image already saved on the server; shown until a new file is picked. */
  currentImageUrl?: string | null;
  currentImageAlt?: string;
  hint?: string;
  className?: string;
  /**
   * Roomy layout for forms with little else on them: a big preview above the drop area, and a tall
   * drop area when nothing is chosen yet. Pair it with `className="flex-col items-stretch"`.
   */
  large?: boolean;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const MAX_UPSCALE = 3;

/**
 * Width that fits the image inside the viewport (96vw / 64rem wide, 90vh tall) while keeping its
 * aspect ratio. Small images are scaled up to fill the screen, but never past MAX_UPSCALE times
 * their own size.
 */
function fittedWidth({ width, height }: { width: number; height: number }): string {
  const widthForHeight = `calc((90vh - 2.75rem - 2rem) * ${width / height})`;
  return `min(96vw - 2rem, 64rem - 2rem, ${widthForHeight}, ${width * MAX_UPSCALE}px)`;
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Styled replacement for `<input type="file">`: click or drop an image, with preview and remove. */
export function AdminFileInput({
  id,
  inputRef,
  accept = "image/jpeg,image/png,image/webp",
  currentImageUrl,
  currentImageAlt = "",
  hint = "JPG, PNG or WebP",
  className,
  large = false,
}: AdminFileInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function select(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setPreviewUrl(previewRef.current);
    setFile(next);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    const input = inputRef.current;
    if (!dropped || !input) return;
    if (!accept.split(",").includes(dropped.type)) return;
    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    input.files = transfer.files;
    select(dropped);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    select(null);
  }

  const shownSrc = previewUrl ?? currentImageUrl ?? null;

  function changeZoom(delta: number) {
    setZoom((value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value + delta)));
  }

  function openViewer() {
    setZoom(1);
    setViewerOpen(true);
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {shownSrc ? (
        <button
          type="button"
          onClick={openViewer}
          className={cn(
            "relative shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-border bg-muted transition-opacity hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            large ? "aspect-[4/3] w-full" : "size-20",
          )}
          aria-label="View full-size image"
        >
          <Image
            src={shownSrc}
            alt={file ? file.name : currentImageAlt}
            fill
            className={large ? "object-contain" : "object-cover"}
            sizes={large ? "(max-width: 1024px) 100vw, 24rem" : "80px"}
            unoptimized={previewUrl !== null}
          />
        </button>
      ) : null}

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        {/* Sized by the image itself (natural size, capped to the viewport), not a fixed full-screen panel. */}
        <DialogContent
          className="flex w-fit min-w-[17rem] max-w-[min(96vw,64rem)] flex-col gap-0 overflow-hidden border bg-card p-0 shadow-2xl sm:max-w-[min(96vw,64rem)] max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:w-screen max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0 max-sm:bg-card [&_[data-slot=dialog-close]]:top-2 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-muted! [&_[data-slot=dialog-close]]:p-1.5 [&_[data-slot=dialog-close]]:text-foreground [&_[data-slot=dialog-close]]:opacity-100"
        >
          <DialogTitle className="sr-only">{file ? file.name : currentImageAlt || "Image preview"}</DialogTitle>
          {shownSrc ? (
            <>
              <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-3 text-foreground">
                <button
                  type="button"
                  onClick={() => changeZoom(-ZOOM_STEP)}
                  disabled={zoom <= MIN_ZOOM}
                  className="inline-flex size-7 items-center justify-center rounded-full hover:bg-muted disabled:opacity-40"
                  aria-label="Zoom out"
                >
                  <ZoomOutIcon className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="min-w-12 rounded-full px-1 text-xs font-medium hover:bg-muted"
                  aria-label="Reset zoom"
                  title="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => changeZoom(ZOOM_STEP)}
                  disabled={zoom >= MAX_ZOOM}
                  className="inline-flex size-7 items-center justify-center rounded-full hover:bg-muted disabled:opacity-40"
                  aria-label="Zoom in"
                >
                  <ZoomInIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
              {/* The zoom wrapper scales the fitted image; this box scrolls once it outgrows the viewport. */}
              <div className="max-h-[calc(90vh-2.75rem)] max-w-[min(96vw,64rem)] overflow-auto bg-muted/40 p-4 max-sm:h-[calc(100dvh-2.75rem)] max-sm:max-h-none max-sm:w-screen max-sm:max-w-none max-sm:p-2">
                <div style={{ zoom }}>
                  <Image
                    src={shownSrc}
                    alt={file ? file.name : currentImageAlt}
                    width={1600}
                    height={1200}
                    onLoad={(event) =>
                      setNatural({
                        width: event.currentTarget.naturalWidth,
                        height: event.currentTarget.naturalHeight,
                      })
                    }
                    onDoubleClick={() => setZoom((value) => (value > 1 ? 1 : 2))}
                    style={natural ? ({ "--fit-w": fittedWidth(natural) } as CSSProperties) : undefined}
                    className={cn(
                      // Desktop: fitted to the viewport. Phones: fill the whole screen (see DialogContent).
                      "block h-auto max-h-[calc(90vh-2.75rem-2rem)] max-w-[calc(min(96vw,64rem)_-_2rem)] rounded-md max-sm:h-[calc(100dvh-2.75rem-1rem)] max-sm:max-h-none max-sm:w-[calc(100vw-1rem)] max-sm:max-w-none max-sm:object-contain",
                      natural ? "w-(--fit-w)" : "w-auto",
                      zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
                    )}
                    unoptimized
                  />
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-20 flex-1 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 transition-colors hover:border-ring hover:bg-muted/50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
          // Large + nothing chosen yet: a tall, centred drop area instead of a slim row.
          large && !shownSrc && "min-h-60 flex-col justify-center gap-2 text-center",
          dragging && "border-ring bg-muted/60",
        )}
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => select(event.target.files?.[0] ?? null)}
        />
        <ImagePlusIcon
          className={cn("shrink-0 text-muted-foreground", large && !shownSrc ? "size-9" : "size-5")}
          aria-hidden="true"
        />
        <span className={cn("min-w-0 text-sm", !(large && !shownSrc) && "flex-1")}>
          {file ? (
            <>
              <span className="block truncate font-medium text-foreground">{file.name}</span>
              <span className="block text-xs text-muted-foreground">{formatSize(file.size)}</span>
            </>
          ) : (
            <>
              <span className="block font-medium text-foreground">
                {currentImageUrl ? "Click to replace image" : "Click to upload"}
                <span className="font-normal text-muted-foreground"> or drag and drop</span>
              </span>
              <span className="block text-xs text-muted-foreground">{hint}</span>
            </>
          )}
        </span>
        {file ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              clear();
            }}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Remove selected file"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </label>
    </div>
  );
}
