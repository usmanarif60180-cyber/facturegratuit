"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useLeads } from "@/hooks/useLeads";
import { useOrganization } from "@/hooks/useOrganization";
import { leadService } from "@/lib/services/leadService";
import { clientService } from "@/lib/services/clientService";
import { formatCurrency } from "@/lib/utils/format";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS } from "@/types/crm";
import { LeadFormDialog } from "@/components/crm/LeadFormDialog";
import type { Lead, PipelineStage } from "@/types";

export default function LeadsPage() {
  const { items: leads, loading, organizationId } = useLeads();
  const { organization } = useOrganization();
  const { toast } = useToast();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead | null>(null);
  const currency = organization?.settings.defaultCurrency ?? "USD";

  const byStage = React.useMemo(() => {
    const map = new Map<PipelineStage, Lead[]>();
    for (const stage of PIPELINE_STAGES) map.set(stage, []);
    for (const lead of leads) map.get(lead.stage)?.push(lead);
    return map;
  }, [leads]);

  async function moveStage(lead: Lead, stage: PipelineStage) {
    if (!organizationId) return;
    await leadService.update(organizationId, lead.id, { stage });
    toast({ variant: "success", title: `Moved to ${PIPELINE_STAGE_LABELS[stage]}` });
  }

  async function convertToClient(lead: Lead) {
    if (!organizationId) return;
    const clientId = await clientService.create(organizationId, {
      displayName: lead.name,
      companyName: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      status: "active",
      source: lead.source,
    });
    await leadService.update(organizationId, lead.id, { stage: "won", convertedClientId: clientId });
    toast({ variant: "success", title: "Lead converted to client" });
    router.push(`/clients/${clientId}`);
  }

  async function handleDelete(lead: Lead) {
    if (!organizationId) return;
    await leadService.remove(organizationId, lead.id);
    toast({ variant: "success", title: "Lead removed" });
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Track prospects through your sales pipeline."
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" /> Add lead
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads yet"
          description="Add your first lead to start building your pipeline."
          action={<Button onClick={() => setDialogOpen(true)}>Add lead</Button>}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = byStage.get(stage) ?? [];
            const stageValue = stageLeads.reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0);
            return (
              <div key={stage} className="w-72 shrink-0">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold">{PIPELINE_STAGE_LABELS[stage]}</h3>
                  <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                </div>
                {stageValue > 0 && (
                  <p className="mb-2 px-1 text-xs text-muted-foreground">{formatCurrency(stageValue, currency)}</p>
                )}
                <div className="space-y-2.5">
                  {stageLeads.map((lead) => (
                    <m.div key={lead.id} layout transition={{ type: "spring", stiffness: 400, damping: 34 }}>
                      <Card className="p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{lead.name}</p>
                            {lead.companyName && (
                              <p className="truncate text-xs text-muted-foreground">{lead.companyName}</p>
                            )}
                          </div>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Lead actions">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              {PIPELINE_STAGES.filter((s) => s !== stage).map((s) => (
                                <DropdownItem key={s} onSelect={() => moveStage(lead, s)}>
                                  Move to {PIPELINE_STAGE_LABELS[s]}
                                </DropdownItem>
                              ))}
                              <DropdownItem onSelect={() => convertToClient(lead)}>Convert to client</DropdownItem>
                              <DropdownItem
                                onSelect={() => {
                                  setEditing(lead);
                                  setDialogOpen(true);
                                }}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem onSelect={() => handleDelete(lead)} className="text-danger">
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                        {lead.estimatedValue !== undefined && (
                          <Badge variant="primary" className="mt-2">
                            {formatCurrency(lead.estimatedValue, lead.currency ?? currency)}
                          </Badge>
                        )}
                      </Card>
                    </m.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {organizationId && (
        <LeadFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          organizationId={organizationId}
          defaultCurrency={currency}
          lead={editing}
        />
      )}
    </div>
  );
}
