"use client";

import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow?: string;
  title?: React.ReactNode;
  description: string;
}

export function ThankYouDialog({
  open,
  onOpenChange,
  eyebrow = "Message received",
  title = (
    <>
      Thank <em className="italic text-primary">you</em>
    </>
  ),
  description,
}: ThankYouDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-[#211e1b]/70 backdrop-blur-[2px]"
        className="gap-0 overflow-hidden rounded-sm border-border bg-card p-0 shadow-none sm:max-w-md"
      >
        <div className="border-b border-border px-8 pt-8 pb-6">
          <div
            className="mb-6 flex size-11 items-center justify-center rounded-sm border border-border bg-background"
            aria-hidden="true"
          >
            <CheckIcon className="size-5 text-primary" strokeWidth={1.5} />
          </div>

          <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-mega text-muted-foreground">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            {eyebrow}
          </p>

          <DialogTitle className="font-serif text-4xl leading-[1.1] font-normal tracking-tight text-foreground">
            {title}
          </DialogTitle>

          <DialogDescription className="mt-4 text-base leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </div>

        <div className="px-8 py-6">
          <DialogClose asChild>
            <Button type="button" size="lg" className="h-11 w-full">
              Got it
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
