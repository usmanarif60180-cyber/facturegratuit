/**
 * Reserved ad placement. Renders nothing until an ad network is configured
 * (NEXT_PUBLIC_ADS_ENABLED=true) — never rendered inside the app/dashboard,
 * invoice or quote editors, or any other core workflow. Only mount this in
 * Blog, Help Center, Resource pages, or the marketing footer.
 */
export function AdSlot({ label = "Advertisement", className }: { label?: string; className?: string }) {
  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
  if (!enabled) return null;

  return (
    <div
      className={className}
      role="complementary"
      aria-label={label}
      data-ad-slot
    >
      {/* Ad network script/unit renders here once configured. */}
    </div>
  );
}
