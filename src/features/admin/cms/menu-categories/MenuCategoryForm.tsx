"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import {
  createAdminMenuCategory,
  fetchAdminMenuCategory,
  updateAdminMenuCategory,
  type MenuCategoryRecord,
} from "@/lib/api/menuCategories";
import { Button } from "@/components/ui/button";
import { InkDots } from "@/components/shared/InkDots";
import { FormActions } from "@/components/admin/FormActions";
import { MenuCategoryFormFields } from "@/features/admin/cms/menu-categories/components/MenuCategoryFormFields";
import {
  EMPTY_MENU_CATEGORY_FORM,
  type MenuCategoryFormState,
} from "@/features/admin/cms/menu-categories/menuCategoryConstants";

interface MenuCategoryFormProps {
  categoryId?: number;
}

export function MenuCategoryForm({ categoryId }: MenuCategoryFormProps) {
  const router = useRouter();
  const editing = categoryId !== undefined;

  const [category, setCategory] = useState<MenuCategoryRecord | null>(null);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState<MenuCategoryFormState>(EMPTY_MENU_CATEGORY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!editing) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetchAdminMenuCategory(categoryId!);
        if (cancelled) return;
        const record = response.data;
        setCategory(record);
        setForm({
          name: record.name,
          status: record.status,
          sort: String(record.sort),
        });
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this menu category.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [categoryId, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const sortNum = Number.parseInt(form.sort, 10);
    if (!Number.isInteger(sortNum) || sortNum < 0) {
      const message = "Order must be a non-negative whole number.";
      toast.error(message);
      setFormError(message);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        status: form.status,
        sort: sortNum,
      };
      if (editing) {
        await updateAdminMenuCategory(categoryId, payload);
        toast.success("Menu category saved", { description: form.name.trim() || undefined });
      } else {
        await createAdminMenuCategory(payload);
        toast.success("Menu category created", { description: form.name.trim() || undefined });
      }
      router.push("/admin/cms/menu-categories");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save this menu category.";
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
          href="/admin/cms/menu-categories"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Menu Categories
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? "Edit Menu Category" : "Add Menu Category"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing
              ? "Update menu category information"
              : "Create a new menu category for the website"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? <p className="mb-4 text-sm text-destructive">{loadError}</p> : null}

          <MenuCategoryFormFields
            form={form}
            onChange={setForm}
            editing={editing}
            category={category}
          />

          <FormActions error={formError}>
            <Button type="button" variant="outline" asChild className="sm:min-w-[5.5rem]">
              <Link href="/admin/cms/menu-categories">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || Boolean(loadError)} className="sm:min-w-[5.5rem]">
              {submitting ? "Saving…" : editing ? "Save category" : "Create category"}
            </Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
