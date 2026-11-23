"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import { updateAdminReservationComments, type ReservationRecord } from "@/lib/api/reservations";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatReservationWhen } from "@/features/admin/reservations/reservationsUtils";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  );
}

interface ReservationDetailDialogProps {
  selected: ReservationRecord | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (record: ReservationRecord) => void;
  onError: (message: string) => void;
}

export function ReservationDetailDialog({
  selected,
  onOpenChange,
  onSaved,
  onError,
}: ReservationDetailDialogProps) {
  const [adminCommentsDraft, setAdminCommentsDraft] = useState("");
  const [savingComments, setSavingComments] = useState(false);

  useEffect(() => {
    setAdminCommentsDraft(selected?.adminComments ?? "");
  }, [selected]);

  async function handleSaveComments() {
    if (!selected) return;
    const trimmed = adminCommentsDraft.trim();
    setSavingComments(true);
    try {
      const response = await updateAdminReservationComments(selected.id, trimmed || null);
      onSaved(response.data);
      toast.success("Comments saved", {
        description: `Request #${selected.id}`,
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save admin comments.";
      toast.error(message);
      onError(message);
    } finally {
      setSavingComments(false);
    }
  }

  return (
    <Dialog open={selected !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {selected ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Reservation details</DialogTitle>
              <DialogDescription>Request #{selected.id}</DialogDescription>
            </DialogHeader>

            <dl className="grid gap-x-4 gap-y-2.5 sm:grid-cols-3">
              <DetailField label="Guest" value={selected.name} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.mobile ?? "—"} />
              <DetailField label="Date & time" value={formatReservationWhen(selected)} />
              <DetailField label="Guests" value={String(selected.guest ?? "—")} />
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-0.5">
                  <StatusBadge status={selected.status} />
                </dd>
              </div>
            </dl>

            <div className="space-y-1">
              <Label htmlFor="detail-request">Special request</Label>
              <Textarea id="detail-request" readOnly value={selected.request ?? "None"} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="detail-restrictions">Restrictions</Label>
              <Textarea id="detail-restrictions" readOnly value={selected.restrictions ?? "None"} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="detail-comments">Comments by admin</Label>
              <Textarea
                id="detail-comments"
                value={adminCommentsDraft}
                onChange={(event) => setAdminCommentsDraft(event.target.value)}
                placeholder="Internal notes for this reservation…"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  disabled={savingComments}
                  onClick={() => void handleSaveComments()}
                  className="mt-2"
                >
                  {savingComments ? "Saving…" : "Save comments"}
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
