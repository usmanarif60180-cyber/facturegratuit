"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { getIndustryPreset } from "@/lib/design/industries";
import { CreateCompanyWizard } from "@/components/workspace/CreateCompanyWizard";
import type { Organization } from "@/types";

function OrgAvatar({ org, size = 28 }: { org: Organization; size?: number }) {
  if (org.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={org.logoUrl}
        alt={org.name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-md object-contain"
      />
    );
  }
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary"
    >
      {org.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function WorkspaceSwitcher() {
  const { organizations, organizationsLoading, switchingOrganization, switchOrganization } = useAuth();
  const { organization: active } = useOrganization();
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = React.useState(false);

  if (organizationsLoading && organizations.length === 0) {
    return <div className="h-9 w-40 animate-pulse rounded-md bg-muted" aria-hidden="true" />;
  }
  if (!active) return null;

  async function handleSwitch(org: Organization) {
    if (org.id === active?.id) return;
    await switchOrganization(org.id);
    toast({ variant: "success", title: `Switched to ${org.name}` });
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button
            className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-sm font-medium hover:bg-muted"
            aria-label="Switch company"
          >
            <OrgAvatar org={active} size={24} />
            <span className="max-w-[9rem] truncate">{active.name}</span>
            {switchingOrganization ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : (
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </DropdownTrigger>
        <DropdownMenu>
          <div className="w-64">
            <p className="px-2.5 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your companies
            </p>
            {organizations.map((org) => (
              <DropdownItem key={org.id} onSelect={() => handleSwitch(org)} className="gap-2.5">
                <OrgAvatar org={org} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{org.name}</span>
                  {org.businessType && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {getIndustryPreset(org.businessType)?.name ?? org.businessType}
                    </span>
                  )}
                </span>
                {org.id === active.id && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </DropdownItem>
            ))}
            <div className="my-1 border-t border-border" />
            <DropdownItem onSelect={() => setWizardOpen(true)} className="gap-2.5 text-primary">
              <Plus className="h-4 w-4" /> Create new company
            </DropdownItem>
          </div>
        </DropdownMenu>
      </Dropdown>

      <CreateCompanyWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
