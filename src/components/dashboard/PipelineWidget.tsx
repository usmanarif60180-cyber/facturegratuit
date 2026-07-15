import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS } from "@/types/crm";
import type { Lead } from "@/types";

export function PipelineWidget({ leads }: { leads: Lead[] }) {
  const open = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const maxCount = Math.max(1, ...PIPELINE_STAGES.map((s) => open.filter((l) => l.stage === s).length));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="h-4 w-4 text-primary" /> Sales pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {open.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No open leads.{" "}
            <Link href="/leads" className="text-primary hover:underline">
              Add one
            </Link>
            .
          </p>
        ) : (
          PIPELINE_STAGES.filter((s) => s !== "won" && s !== "lost").map((stage) => {
            const count = open.filter((l) => l.stage === stage).length;
            const width = count === 0 ? 0 : Math.max((count / maxCount) * 100, 8);
            return (
              <div key={stage} className="flex items-center gap-2 text-xs">
                <span className="w-16 shrink-0 text-muted-foreground">{PIPELINE_STAGE_LABELS[stage]}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${width}%` }} />
                </div>
                <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground">{count}</span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
