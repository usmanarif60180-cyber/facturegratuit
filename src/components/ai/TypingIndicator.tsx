export function TypingIndicator() {
  return (
    <div
      className="flex w-fit items-center gap-1 rounded-lg bg-muted px-4 py-3"
      role="status"
      aria-label="Assistant is responding"
    >
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground" style={{ animationDelay: "0s" }} />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground" style={{ animationDelay: "0.15s" }} />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted-foreground" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}
