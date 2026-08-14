import { cn } from "@/lib/utils";

interface StatItemProps {
  value: string;
  label: string;
  className?: string;
}

/** A centered value + uppercase caption, used in the matching stats bar. */
export function StatItem({ value, label, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col items-center gap-[3px]", className)}>
      <span className="font-heading text-[22px] font-semibold leading-none tracking-[-0.01em]">
        {value}
      </span>
      <span className="text-muted text-[10px] uppercase tracking-[0.06em]">
        {label}
      </span>
    </div>
  );
}
