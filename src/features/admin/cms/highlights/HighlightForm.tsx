"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import {
  createAdminHighlight,
  fetchAdminHighlight,
  updateAdminHighlight,
  type HighlightRecord,
} from "@/lib/api/highlights";
import { AdminFileInput } from "@/components/admin/AdminFileInput";
import { FormActions } from "@/components/admin/FormActions";
import { FormSection } from "@/components/admin/FormSection";
import { InkDots } from "@/components/shared/InkDots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface HighlightFormProps {
  highlightId?: number;
}

export function HighlightForm({ highlightId }: HighlightFormProps) {
  const router = useRouter();
  const editing = highlightId !== undefined;

  const [highlight, setHighlight] = useState<HighlightRecord | null>(null);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [sort, setSort] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetchAdminHighlight(highlightId!);
        if (cancelled) return;
        const record = response.data;
        setHighlight(record);
        setName(record.name ?? "");
        setDescription(record.description ?? "");
        setStatus(record.status);
        setSort(String(record.sort));
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this highlight.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [highlightId, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const sortNum = Number.parseInt(sort, 10);
    if (!Number.isInteger(sortNum) || sortNum < 0) {
      const message = "Order must be a non-negative whole number.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name || undefined,
      description: description || undefined,
      status,
      sort: sortNum,
      image: imageInputRef.current?.files?.[0],
    };
    try {
      if (editing) {
        await updateAdminHighlight(highlightId, payload);
        toast.success("Highlight saved", { description: name.trim() || undefined });
      } else {
        await createAdminHighlight(payload);
        toast.success("Highlight created", { description: name.trim() || undefined });
      }
      router.push("/admin/cms/highlights");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save this highlight.";
      toast.error(message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-5 space-y-3">
        <Link
          href="/admin/cms/highlights"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Homepage Highlights
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? "Edit Highlight" : "Add Highlight"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing
              ? "Update this homepage highlight"
              : "Create a new promo card for the homepage"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? <p className="mb-4 text-sm text-destructive">{loadError}</p> : null}

          {/* Few fields, so one roomy card: a big image area on the left, the details beside it. */}
          <div className="grid grid-cols-1 gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
            <FormSection
              title="Image"
              description={
                editing
                  ? "Optional. A new upload replaces the current image when you save."
                  : "Upload the image shown on the homepage card."
              }
            >
              <AdminFileInput
                id="highlight-image"
                inputRef={imageInputRef}
                currentImageUrl={highlight?.imageUrl ? toGalleryAssetUrl(highlight.imageUrl) : null}
                currentImageAlt={name.trim() || "Highlight"}
                className="flex-col items-stretch"
                large
              />
            </FormSection>

            <div className="lg:border-l lg:border-border lg:pl-10">
              <FormSection
                title="Highlight Details"
                description="Name, description, display order and visibility."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="highlight-name">Name</Label>
                    <Input
                      id="highlight-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="highlight-description">Description</Label>
                    <Textarea
                      id="highlight-description"
                      rows={5}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highlight-sort">Order</Label>
                    <Input
                      id="highlight-sort"
                      type="number"
                      min={0}
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highlight-status">Status</Label>
                    <Select
                      value={status ? "active" : "inactive"}
                      onValueChange={(value) => setStatus(value === "active")}
                    >
                      <SelectTrigger id="highlight-status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          <FormActions error={formError}>
            <Button type="button" variant="outline" asChild className="sm:min-w-[5.5rem]">
              <Link href="/admin/cms/highlights">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || Boolean(loadError)} className="sm:min-w-[5.5rem]">
              {submitting ? "Saving…" : editing ? "Save highlight" : "Create highlight"}
            </Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
