"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/core/client";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import { fetchAdminPage, updateAdminPage, type CmsPageAdminView, type PageSlug } from "@/lib/api/pages";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminFileInput } from "@/components/admin/AdminFileInput";
import { Label } from "@/components/ui/label";
import { InkDots } from "@/components/shared/InkDots";
import {
  cmsPageToFormState,
  type CmsPageConfig,
  type CmsPageFormState,
} from "@/features/admin/cms/pages/pagesConstants";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor").then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div className="h-48 rounded-md border border-input bg-muted/40" /> },
);

interface PageEditorProps {
  slug: PageSlug;
  config: CmsPageConfig;
}

export function PageEditor({ slug, config }: PageEditorProps) {
  const [page, setPage] = useState<CmsPageAdminView | null>(null);
  const [form, setForm] = useState<CmsPageFormState | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetchAdminPage(slug, [
          "title",
          "description",
          ...(config.showShort ? (["short"] as const) : []),
          ...(config.showBanner ? (["bannerUrl"] as const) : []),
        ]);
        if (!cancelled) {
          setPage(response.data);
          setForm(cmsPageToFormState(response.data));
          setLoadError("");
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this page.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, config.showShort, config.showBanner]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaveError("");
    setSaved(false);
    setSubmitting(true);
    try {
      const response = await updateAdminPage(slug, {
        title: form.title,
        ...(config.showShort ? { short: form.short } : {}),
        description: form.description,
        ...(config.showBanner && fileInputRef.current?.files?.[0]
          ? { banner: fileInputRef.current.files[0] }
          : {}),
      });
      setPage(response.data);
      setSaved(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Could not save this page.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-destructive">{loadError}</p>
        </CardContent>
      </Card>
    );
  }

  if (!page || !form) {
    return (
      <Card>
        <CardContent>
          <InkDots label="Loading page" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`${slug}-title`}>Name</Label>
            <Input
              id={`${slug}-title`}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </div>

          {config.showBanner ? (
            <div className="space-y-2">
              <Label htmlFor={`${slug}-banner`}>Banner image</Label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {page.bannerUrl ? (
                  <div className="relative aspect-[16/9] w-full max-w-md shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <Image
                      src={toGalleryAssetUrl(page.bannerUrl)}
                      alt={form.title || config.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 28rem"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1 space-y-1">
                  <AdminFileInput id={`${slug}-banner`} inputRef={fileInputRef} />
                  <p className="text-xs text-muted-foreground">Optional — replaces the current banner.</p>
                </div>
              </div>
            </div>
          ) : null}

          {config.showShort ? (
            <div className="space-y-2">
              <Label htmlFor={`${slug}-short`}>Short description</Label>
              <RichTextEditor
                id={`${slug}-short`}
                height="12rem"
                value={form.short}
                onChange={(value) => setForm({ ...form, short: value })}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor={`${slug}-description`}>Description</Label>
            <RichTextEditor
              id={`${slug}-description`}
              height="28rem"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
            />
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
            <div className="sm:mr-auto">
              {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
              {saved ? <p className="text-sm text-muted-foreground">Saved.</p> : null}
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
