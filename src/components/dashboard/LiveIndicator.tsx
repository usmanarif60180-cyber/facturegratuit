/** Signals that these figures are live Firestore data, not a static snapshot. */
export function LiveIndicator() {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" aria-hidden="true" />
      Live
    </span>
  );
}
