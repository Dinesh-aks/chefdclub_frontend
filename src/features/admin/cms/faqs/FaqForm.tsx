"use client";

import { useEffect, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import {
  createAdminFaq,
  fetchAdminFaq,
  updateAdminFaq,
  type FaqCategory,
} from "@/lib/api/faq";
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
import { InkDots } from "@/components/shared/InkDots";
import {
  EMPTY_FAQ_FORM,
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  type FaqFormState,
} from "@/features/admin/cms/faqs/faqConstants";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor").then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div className="h-48 rounded-md border border-input bg-muted/40" /> },
);

/** Answers saved as plain text (no tags) lose their line breaks in the editor, so turn them into paragraphs. */
function plainTextToHtml(answer: string): string {
  if (/<[a-z][^>]*>/i.test(answer)) return answer;
  return answer
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => `<p>${line}</p>`)
    .join("");
}

interface FaqFormProps {
  faqId?: number;
}

export function FaqForm({ faqId }: FaqFormProps) {
  const router = useRouter();
  const editing = faqId !== undefined;

  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState<FaqFormState>(EMPTY_FAQ_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (faqId === undefined) return;
    const id = faqId;
    let cancelled = false;

    async function load() {
      try {
        const response = await fetchAdminFaq(id);
        if (cancelled) return;
        const record = response.data;
        setForm({
          question: record.question,
          answer: plainTextToHtml(record.answer),
          category: record.category,
          sort: String(record.sort),
          status: record.status,
        });
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this FAQ.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [editing, faqId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const sort = Number.parseInt(form.sort, 10);
    if (!Number.isInteger(sort) || sort < 0) {
      const message = "Order must be a non-negative whole number.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (!form.answer.replace(/<[^>]*>|&nbsp;/g, "").trim()) {
      const message = "Answer is required.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category,
      sort,
      status: form.status,
    };

    setSubmitting(true);
    try {
      if (editing) {
        await updateAdminFaq(faqId, payload);
        toast.success("FAQ saved");
      } else {
        await createAdminFaq(payload);
        toast.success("FAQ created");
      }
      router.push("/admin/cms/faqs");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save this FAQ.";
      toast.error(message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[68rem]">
      <header className="mb-6 space-y-3">
        <Link
          href="/admin/cms/faqs"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          FAQs
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{editing ? "Edit FAQ" : "Add FAQ"}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing ? "Update FAQ information" : "Create a new FAQ for the website"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <div className="rounded-lg border border-border bg-card shadow-sm">
          {loadError ? (
            <p className="border-b border-border px-6 py-4 text-sm text-destructive">{loadError}</p>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-8 sm:px-8">
            <div className="space-y-2">
              <Label htmlFor="faq-question" required>Question</Label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(event) => setForm({ ...form, question: event.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-answer" required>Answer</Label>
              <RichTextEditor
                id="faq-answer"
                value={form.answer}
                onChange={(value) => setForm({ ...form, answer: value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label required>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value as FaqCategory })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {FAQ_CATEGORY_LABELS[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faq-sort" required>Order</Label>
                <Input
                  id="faq-sort"
                  type="number"
                  min={0}
                  value={form.sort}
                  onChange={(event) => setForm({ ...form, sort: event.target.value })}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.checked })}
              />
              Active
            </label>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" asChild className="sm:min-w-[5.5rem]">
                <Link href="/admin/cms/faqs">Cancel</Link>
              </Button>
              <Button type="submit" disabled={submitting || Boolean(loadError)} className="sm:min-w-[5.5rem]">
                {submitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
