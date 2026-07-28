"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EndCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function EndCallDialog({ open, onOpenChange, onConfirm }: EndCallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false}>
        <DialogHeader>
          <DialogTitle>End the call?</DialogTitle>
          <DialogDescription>
            You&apos;ll be disconnected from this stranger. You can start a new
            match anytime.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            End call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
