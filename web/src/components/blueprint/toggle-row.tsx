"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** A labelled row with a title, sub-description, and a trailing switch. */
export function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-muted text-xs">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
