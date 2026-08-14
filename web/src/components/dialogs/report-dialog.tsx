"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { REPORT_AUTOCLOSE_MS, REPORT_REASONS } from "@/constants";
import { cn } from "@/lib/utils";
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
import { ToggleRow } from "@/components/blueprint/toggle-row";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (reason: ReportReason, details?: string) => void;
  onBlock?: () => void;
}

export function ReportDialog({ open, onOpenChange, onSubmit, onBlock }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [blockUser, setBlockUser] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Reset the form each time the dialog opens.
  useEffect(() => {
    if (open) {
      setReason("");
      setBlockUser(true);
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
      <DialogContent showClose={!submitted} className="max-w-[420px] gap-0 p-0">
        {submitted ? (
          <DialogHeader className="p-5">
            <DialogTitle>Report sent</DialogTitle>
            <DialogDescription>
              Thanks — we&apos;ll review this conversation.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-divider px-5 pb-4 pt-5">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-amber-tint">
                <AlertTriangle className="h-4 w-4 text-amber" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-heading text-base font-bold">
                  Report this user
                </div>
                <p className="m-0 mt-0.5 text-xs text-muted">
                  Your report is anonymous. We review every one.
                </p>
              </div>
            </div>

            <RadioGroup
              value={reason}
              onValueChange={(v) => setReason(v as ReportReason)}
              className="gap-1 px-2.5 py-2.5"
            >
              {REPORT_REASONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                    reason === option.value && "bg-accent-100",
                  )}
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>

            <div className="flex flex-col gap-3 border-t border-divider p-3.5">
              <div className="flex flex-col gap-1 rounded-md bg-neutral-100 p-3">
                <ToggleRow
                  title="Also block this user"
                  description="They won't be able to match with you again."
                  checked={blockUser}
                  onCheckedChange={setBlockUser}
                />
              </div>

              <DialogFooter className="m-0">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-[2]"
                  disabled={!reason}
                  onClick={() => {
                    if (reason) {
                      onSubmit?.(reason);
                      if (blockUser) onBlock?.();
                    }
                    setSubmitted(true);
                  }}
                >
                  Submit report
                </Button>
              </DialogFooter>

              <p className="m-0 text-center text-[11px] text-muted">
                Reviewed within 24 hours · Never shared with the reported user
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
