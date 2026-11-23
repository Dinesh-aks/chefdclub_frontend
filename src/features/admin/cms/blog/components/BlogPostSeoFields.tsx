"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlogPostFormState } from "@/features/admin/cms/blog/blogPostFormConstants";

interface BlogPostSeoFieldsProps {
  form: BlogPostFormState;
  onChange: (form: BlogPostFormState) => void;
}

export function BlogPostSeoFields({ form, onChange }: BlogPostSeoFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="post-seo-title">SEO title</Label>
        <Input
          id="post-seo-title"
          value={form.seoTitle}
          onChange={(event) => onChange({ ...form, seoTitle: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="post-seo-description">SEO description</Label>
        <Input
          id="post-seo-description"
          value={form.seoDescription}
          onChange={(event) => onChange({ ...form, seoDescription: event.target.value })}
        />
      </div>
    </div>
  );
}
