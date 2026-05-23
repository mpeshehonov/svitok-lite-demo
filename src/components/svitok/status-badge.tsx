"use client";

import { cn } from "@/lib/utils";
import type { CheckStatus } from "@/types/document";

const statusStyles: Record<CheckStatus, { container: string; icon: string; label: string }> = {
  success: {
    container: "border-svitok-success/20 bg-svitok-success/10",
    icon: "text-svitok-success",
    label: "text-svitok-success",
  },
  warning: {
    container: "border-svitok-warning/20 bg-svitok-warning/10",
    icon: "text-svitok-warning",
    label: "text-svitok-warning",
  },
  error: {
    container: "border-svitok-error/20 bg-svitok-error/10",
    icon: "text-svitok-error",
    label: "text-svitok-error",
  },
  info: {
    container: "border-svitok-accent/20 bg-svitok-accent/10",
    icon: "text-svitok-accent",
    label: "text-svitok-accent",
  },
};

const statusIcons: Record<CheckStatus, string> = {
  success: "✅",
  warning: "⚠️",
  error: "❌",
  info: "ℹ️",
};

interface StatusBadgeProps {
  status: CheckStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center text-sm",
        styles.icon,
        className
      )}
      aria-hidden
    >
      {statusIcons[status]}
    </span>
  );
}

export function getStatusRowClass(status: CheckStatus): string {
  return statusStyles[status].container;
}

export function getStatusLabelClass(status: CheckStatus): string {
  return statusStyles[status].label;
}
