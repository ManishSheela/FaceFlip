"use client";

import { useEffect, useState } from "react";
import { REPORT_AUTOCLOSE_MS, REPORT_REASONS } from "@/constants";
import type { ReportReason } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDialog({ open, onOpenChange }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [submitted, setSubmitted] = useState(false);

  // Reset the form each time the dialog opens.
  useEffect(() => {
    if (open) {
      setReason("");
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    if (!submitted) return;
    const id = setTimeout(() => onOpenChange(false), REPORT_AUTOCLOSE_MS);
    return () => clearTimeout(id);
  }, [submitted, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={!submitted}>
        {submitted ? (
          <DialogHeader>
            <DialogTitle>Report sent</DialogTitle>
            <DialogDescription>
              Thanks — we&apos;ll review this conversation.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Report this user</DialogTitle>
            </DialogHeader>
            <RadioGroup
              value={reason}
              onValueChange={(v) => setReason(v as ReportReason)}
              className="gap-2 py-1"
            >
              {REPORT_REASONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
            <DialogFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!reason}
                onClick={() => setSubmitted(true)}
              >
                Submit
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
