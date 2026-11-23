"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import {
  createAdminSpotlight,
  fetchAdminSpotlight,
  updateAdminSpotlight,
  SPOTLIGHT_PLACEMENT_LABELS,
  type SpotlightPlacement,
  type SpotlightRecord,
} from "@/lib/api/spotlight";
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

interface SpotlightFormProps {
  cardId?: number;
}

export function SpotlightForm({ cardId }: SpotlightFormProps) {
  const router = useRouter();
  const editing = cardId !== undefined;

  const [card, setCard] = useState<SpotlightRecord | null>(null);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [badge, setBadge] = useState("");
  const [placement, setPlacement] = useState<SpotlightPlacement>("hero");
  const [alt, setAlt] = useState("");
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
        const { data } = await fetchAdminSpotlight(cardId!);
        if (cancelled) return;
        setCard(data);
        setTitle(data.title);
        setTag(data.tag ?? "");
        setBadge(data.badge ?? "");
        setPlacement(data.placement);
        setAlt(data.alt ?? "");
        setStatus(data.status);
        setSort(String(data.sort));
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this card.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [cardId, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const fail = (message: string) => {
      setFormError(message);
      toast.error(message);
    };

    const sortNum = Number.parseInt(sort, 10);
    if (!Number.isInteger(sortNum) || sortNum < 0) {
      return fail("Order must be a non-negative whole number.");
    }
    const image = imageInputRef.current?.files?.[0];
    if (!editing && !image) return fail("Choose an image for the card.");

    setSubmitting(true);
    const payload = { title, tag, badge, placement, alt, status, sort: sortNum, image };
    try {
      if (editing) {
        await updateAdminSpotlight(cardId, payload);
        toast.success("Card saved", { description: title.trim() || undefined });
      } else {
        await createAdminSpotlight(payload);
        toast.success("Card created", { description: title.trim() || undefined });
      }
      router.push("/admin/cms/spotlight");
    } catch (err) {
      fail(err instanceof ApiError ? err.message : "Could not save this card.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-5 space-y-3">
        <Link
          href="/admin/cms/spotlight"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Homepage Photo Cards
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? "Edit Photo Card" : "Add Photo Card"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing
              ? "Update this dish photo card on the homepage"
              : "Add a dish photo card to the homepage"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? <p className="mb-4 text-sm text-destructive">{loadError}</p> : null}

          <div className="grid grid-cols-1 gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
            <FormSection
              title="Image"
              description={
                editing
                  ? "Optional. A new upload replaces the current image when you save."
                  : placement === "hero"
                    ? "The dish photo. In the hero it is shown wide (about 16:9), so a landscape photo works best."
                    : "The dish photo. In the story section it is shown tall (about 4:5), so a portrait or square photo works best."
              }
            >
              <AdminFileInput
                id="spotlight-image"
                inputRef={imageInputRef}
                currentImageUrl={card?.imageUrl ? toGalleryAssetUrl(card.imageUrl) : null}
                currentImageAlt={alt.trim() || title.trim() || "Spotlight card"}
                className="flex-col items-stretch"
                large
              />
              <div className="mt-5 space-y-2">
                <Label htmlFor="spotlight-alt">Image alt text</Label>
                <Input
                  id="spotlight-alt"
                  maxLength={255}
                  placeholder={title.trim() || "Describe what the photo shows"}
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Read out by screen readers and used by search engines. Describe the photo itself.
                  Left empty, the title is used.
                </p>
              </div>
            </FormSection>

            <div className="lg:border-l lg:border-border lg:pl-10">
              <FormSection
                title="Card Details"
                description="The text shown over the photo, plus order and visibility."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="spotlight-placement">Where it shows</Label>
                    <Select
                      value={placement}
                      onValueChange={(value) => setPlacement(value as SpotlightPlacement)}
                    >
                      <SelectTrigger id="spotlight-placement" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(SPOTLIGHT_PLACEMENT_LABELS) as SpotlightPlacement[]).map((value) => (
                          <SelectItem key={value} value={value}>
                            {SPOTLIGHT_PLACEMENT_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="spotlight-title">Title</Label>
                    <Input
                      id="spotlight-title"
                      maxLength={255}
                      placeholder="Crabmeat omelette, passionfruit balsamic emulsion"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spotlight-tag">Tag</Label>
                    <Input
                      id="spotlight-tag"
                      maxLength={255}
                      placeholder="New this season"
                      value={tag}
                      onChange={(event) => setTag(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spotlight-badge">Badge</Label>
                    <Input
                      id="spotlight-badge"
                      maxLength={50}
                      placeholder="Spotlight"
                      value={badge}
                      onChange={(event) => setBadge(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spotlight-sort">Order</Label>
                    <Input
                      id="spotlight-sort"
                      type="number"
                      min={0}
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spotlight-status">Status</Label>
                    <Select
                      value={status ? "active" : "inactive"}
                      onValueChange={(value) => setStatus(value === "active")}
                    >
                      <SelectTrigger id="spotlight-status" className="w-full">
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
              <Link href="/admin/cms/spotlight">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || Boolean(loadError)} className="sm:min-w-[5.5rem]">
              {submitting ? "Saving…" : editing ? "Save card" : "Create card"}
            </Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
