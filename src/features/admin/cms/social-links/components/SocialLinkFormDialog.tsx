"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/core/client";
import { updateAdminSocialLink, type SocialLinkRecord } from "@/lib/api/socialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EMPTY_SOCIAL_LINK_FORM,
  type SocialLinkFormState,
} from "@/features/admin/cms/social-links/socialLinkConstants";

interface SocialLinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: SocialLinkRecord | null;
  onSaved: () => void | Promise<void>;
}

export function SocialLinkFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: SocialLinkFormDialogProps) {
  const [form, setForm] = useState<SocialLinkFormState>(EMPTY_SOCIAL_LINK_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({ link: editing.link, icon: editing.icon });
    } else {
      setForm(EMPTY_SOCIAL_LINK_FORM);
    }
    setFormError("");
  }, [open, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      if (editing) {
        await updateAdminSocialLink(editing.id, { link: form.link });
      }
      onOpenChange(false);
      await onSaved();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not save this social link.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Social Link</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="social-link" required>Link</Label>
            <Input
              id="social-link"
              type="url"
              value={form.link}
              onChange={(event) => setForm({ ...form, link: event.target.value })}
              placeholder="https://…"
              required
            />
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
