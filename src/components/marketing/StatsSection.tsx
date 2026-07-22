const STATS = [
  { value: "20+", label: "Supported currencies" },
  { value: "10+", label: "Languages on the roadmap" },
  { value: "100%", label: "Free to start, no card required" },
  { value: "24/7", label: "Available, anywhere" },
];

/**
 * Ready for real usage metrics once we have them (invoices created, active
 * workspaces, etc.) — populated today with true product facts rather than
 * invented traction numbers.
 */
export function StatsSection() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">{stat.value}</p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
