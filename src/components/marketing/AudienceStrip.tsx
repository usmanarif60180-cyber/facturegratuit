const AUDIENCES = ["Freelancers", "Consultants", "Agencies", "Contractors", "Startups", "Small Businesses"];

/** Honest stand-in for customer logos before we have real ones to show — who IVOXA is built for, not who's using it yet. */
export function AudienceStrip() {
  return (
    <div>
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Built for
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {AUDIENCES.map((a) => (
          <span
            key={a}
            className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
