"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import { fetchAdminMenuCategories, type MenuCategoryRecord } from "@/lib/api/menuCategories";
import {
  createAdminMenuCard,
  fetchAdminMenuCard,
  updateAdminMenuCard,
  type MenuCardRecord,
  type MenuCardType,
} from "@/lib/api/menuCards";
import { Button } from "@/components/ui/button";
import { InkDots } from "@/components/shared/InkDots";
import { FormActions } from "@/components/admin/FormActions";
import { MenuCardFormFields } from "@/features/admin/cms/menu-cards/components/MenuCardFormFields";
import {
  EMPTY_MENU_CARD_FORM,
  type MenuCardFormState,
} from "@/features/admin/cms/menu-cards/menuCardConstants";

interface MenuCardFormProps {
  cardId?: number;
}

export function MenuCardForm({ cardId }: MenuCardFormProps) {
  const router = useRouter();
  const editing = cardId !== undefined;

  const [categories, setCategories] = useState<MenuCategoryRecord[]>([]);
  const [card, setCard] = useState<MenuCardRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState<MenuCardFormState>(EMPTY_MENU_CARD_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [categoriesResponse, cardResponse] = await Promise.all([
          fetchAdminMenuCategories({ limit: 100, page: 1 }),
          editing ? fetchAdminMenuCard(cardId) : Promise.resolve(null),
        ]);
        if (cancelled) return;

        setCategories(categoriesResponse.data.items);

        if (cardResponse) {
          const record = cardResponse.data;
          setCard(record);
          setForm({
            menu: String(record.menu),
            type: String(record.type),
            name: record.name,
            slug: record.slug,
            status: record.status,
            sort: String(record.sort),
            showOnHome: record.showOnHome,
          });
        } else {
          const firstCategory = categoriesResponse.data.items[0];
          setForm({
            ...EMPTY_MENU_CARD_FORM,
            menu: firstCategory ? String(firstCategory.id) : "",
          });
        }
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this menu card.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [editing, cardId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const sortNum = Number.parseInt(form.sort, 10);
    if (!Number.isInteger(sortNum) || sortNum < 0) {
      const message = "Order must be a non-negative whole number.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const banner = bannerInputRef.current?.files?.[0];
    setSubmitting(true);
    try {
      const payload = {
        menu: Number.parseInt(form.menu, 10),
        type: Number.parseInt(form.type, 10) as MenuCardType,
        name: form.name,
        slug: form.slug,
        status: form.status,
        sort: sortNum,
        showOnHome: form.showOnHome,
        banner,
      };
      if (editing) {
        await updateAdminMenuCard(cardId, payload);
        toast.success("Menu card saved", { description: form.name.trim() || undefined });
      } else {
        await createAdminMenuCard(payload);
        toast.success("Menu card created", { description: form.name.trim() || undefined });
      }
      router.push("/admin/cms/menu-cards");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save this menu card.";
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
          href="/admin/cms/menu-cards"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Menu Photo Cards
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? "Edit Menu Card" : "Add Menu Card"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing ? "Update menu card information" : "Create a new menu photo card for the website"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? <p className="mb-4 text-sm text-destructive">{loadError}</p> : null}

          <MenuCardFormFields
            form={form}
            onChange={setForm}
            categories={categories}
            editing={editing}
            card={card}
            bannerInputRef={bannerInputRef}
          />

          <FormActions error={formError}>
            <Button type="button" variant="outline" asChild className="sm:min-w-[5.5rem]">
              <Link href="/admin/cms/menu-cards">Cancel</Link>
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
