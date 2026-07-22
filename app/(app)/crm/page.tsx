"use client";

import * as React from "react";
import { Briefcase, TrendingUp, UserCheck, UserX } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLeads } from "@/hooks/useLeads";
import { useClients } from "@/hooks/useClients";
import { useOrganization } from "@/hooks/useOrganization";
import { formatCurrency } from "@/lib/utils/format";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS, PIPELINE_STAGE_PROBABILITY } from "@/types/crm";

export default function CrmDashboardPage() {
  const { items: leads, loading: leadsLoading } = useLeads();
  const { items: clients, loading: clientsLoading } = useClients();
  const { organization } = useOrganization();
  const currency = organization?.settings.defaultCurrency ?? "USD";
  const loading = leadsLoading || clientsLoading;

  const newLeads = leads.filter((l) => l.stage !== "won" && l.stage !== "lost").length;
  const lostDeals = leads.filter((l) => l.stage === "lost").length;
  const activeClients = clients.filter((c) => (c.status ?? "active") === "active").length;

  const forecast = leads
    .filter((l) => l.stage !== "won" && l.stage !== "lost")
    .reduce((sum, l) => sum + (l.estimatedValue ?? 0) * PIPELINE_STAGE_PROBABILITY[l.stage], 0);

  const byStage = React.useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    for (const stage of PIPELINE_STAGES) map.set(stage, { count: 0, value: 0 });
    for (const lead of leads) {
      const entry = map.get(lead.stage)!;
      entry.count += 1;
      entry.value += lead.estimatedValue ?? 0;
    }
    return map;
  }, [leads]);

  const maxCount = Math.max(1, ...Array.from(byStage.values()).map((v) => v.count));

  return (
    <div>
      <PageHeader title="CRM" description="Your sales pipeline and customer relationships at a glance." />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "New leads", value: newLeads, icon: Briefcase },
            { label: "Active clients", value: activeClients, icon: UserCheck },
            { label: "Lost deals", value: lostDeals, icon: UserX },
            {
              label: "Revenue forecast",
              value: forecast,
              icon: TrendingUp,
              formatValue: (n: number) => formatCurrency(n, currency),
            },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <StatCard {...stat} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {PIPELINE_STAGES.map((stage) => {
              const entry = byStage.get(stage)!;
              const width = entry.count === 0 ? 0 : Math.max((entry.count / maxCount) * 100, 6);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm font-medium">{PIPELINE_STAGE_LABELS[stage]}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{entry.count}</span>
                  <span className="w-24 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                    {entry.value > 0 ? formatCurrency(entry.value, currency) : "—"}
                  </span>
                </div>
              );
            })}
            <p className="pt-1 text-xs text-muted-foreground">
              Revenue forecast is an estimate — each stage&apos;s open value weighted by a typical win probability, not a prediction.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
