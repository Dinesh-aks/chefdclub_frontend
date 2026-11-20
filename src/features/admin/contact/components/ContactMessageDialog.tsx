"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/core/client";
import { fetchAdminContactMessage, type ContactMessageRecord } from "@/lib/api/contact";
import { InkDots } from "@/components/shared/InkDots";
import { formatBusinessDateTime } from "@/lib/formatDateTime";

interface ContactMessageDialogProps {
  messageId: number | null;
  onOpenChange: (open: boolean) => void;
}

export function ContactMessageDialog({ messageId, onOpenChange }: ContactMessageDialogProps) {
  const [loaded, setLoaded] = useState<ContactMessageRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (messageId === null) return;
    let cancelled = false;
    setLoaded(null);
    setError("");

    fetchAdminContactMessage(messageId)
      .then((response) => {
        if (!cancelled) setLoaded(response.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load this message.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [messageId]);

  const selected = loaded?.id === messageId ? loaded : null;

  return (
    <Dialog open={messageId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {messageId !== null && !selected ? (
          <>
            <DialogHeader>
              <DialogTitle>Contact message</DialogTitle>
              <DialogDescription className="sr-only">Loading the contact message</DialogDescription>
            </DialogHeader>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <InkDots label="Loading message" />
            )}
          </>
        ) : null}
        {selected ? (
          <>
            <DialogHeader>
              <DialogTitle>Contact message</DialogTitle>
              <DialogDescription>Submitted {formatBusinessDateTime(selected.addDate)}</DialogDescription>
            </DialogHeader>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{selected.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                    {selected.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Mobile</dt>
                <dd>{selected.mobile ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Subject</dt>
                <dd>{selected.subject?.trim() ? selected.subject : "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-3">
                  {selected.message}
                </dd>
              </div>
            </dl>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
