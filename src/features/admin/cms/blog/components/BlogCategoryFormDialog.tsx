"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/core/client";
import {
  createAdminBlogCategory,
  updateAdminBlogCategory,
  type BlogCategoryRecord,
} from "@/lib/api/blog";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EMPTY_BLOG_CATEGORY_FORM,
  type BlogCategoryFormState,
} from "@/features/admin/cms/blog/blogCategoryConstants";

interface BlogCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: BlogCategoryRecord | null;
  onSaved: () => void | Promise<void>;
}

export function BlogCategoryFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: BlogCategoryFormDialogProps) {
  const [form, setForm] = useState<BlogCategoryFormState>(EMPTY_BLOG_CATEGORY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        category: editing.category,
        slug: editing.slug,
        status: editing.status,
        sort: String(editing.sort),
      });
    } else {
      setForm(EMPTY_BLOG_CATEGORY_FORM);
    }
    setFormError("");
  }, [open, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const sortNum = Number.parseInt(form.sort, 10);
    if (!Number.isInteger(sortNum) || sortNum < 0) {
      setFormError("Order must be a non-negative whole number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { category: form.category, slug: form.slug, status: form.status, sort: sortNum };
      if (editing) {
        await updateAdminBlogCategory(editing.id, payload);
      } else {
        await createAdminBlogCategory(payload);
      }
      onOpenChange(false);
      await onSaved();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not save this category.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="blog-cat-name" required>Category</Label>
            <Input
              id="blog-cat-name"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blog-cat-slug" required>Slug</Label>
            <Input
              id="blog-cat-slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blog-cat-sort">Order</Label>
              <Input
                id="blog-cat-sort"
                type="number"
                min={0}
                value={form.sort}
                onChange={(event) => setForm({ ...form, sort: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-cat-status">Status</Label>
              <Select
                value={form.status ? "active" : "inactive"}
                onValueChange={(value) => setForm({ ...form, status: value === "active" })}
              >
                <SelectTrigger id="blog-cat-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
