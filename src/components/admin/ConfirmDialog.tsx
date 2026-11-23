"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PendingConfirm = {
  message: string;
  resolve: (confirmed: boolean) => void;
};

/**
 * Promise-based replacement for `window.confirm` that matches the admin UI.
 *
 *   const { confirm, confirmDialog } = useConfirm();
 *   if (!(await confirm('Delete "Foo"?'))) return;
 *   ...
 *   return <>{...}{confirmDialog}</>;
 */
export function useConfirm(): {
  confirm: (message: string) => Promise<boolean>;
  confirmDialog: ReactNode;
} {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback(
    (message: string) =>
      new Promise<boolean>((resolve) => {
        setPending({ message, resolve });
      }),
    [],
  );

  function settle(confirmed: boolean) {
    pending?.resolve(confirmed);
    setPending(null);
  }

  const confirmDialog = (
    <Dialog open={pending !== null} onOpenChange={(open) => !open && settle(false)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">{pending?.message}</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => settle(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={() => settle(true)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, confirmDialog };
}
