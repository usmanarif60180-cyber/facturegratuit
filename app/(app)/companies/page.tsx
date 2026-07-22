"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, MoreHorizontal, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { useCompanies } from "@/hooks/useCompanies";
import { companyService } from "@/lib/services/companyService";
import { CompanyFormDialog } from "@/components/crm/CompanyFormDialog";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const { items: companies, loading, organizationId } = useCompanies();
  const { toast } = useToast();

  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Company | null>(null);

  const filtered = companies.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(company: Company) {
    if (!organizationId) return;
    await companyService.remove(organizationId, company.id);
    toast({ variant: "success", title: "Company removed" });
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Organizations behind your customers and leads."
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Building2 className="h-4 w-4" /> Add company
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search companies…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="rounded-lg border border-border">
          <TableSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={companies.length === 0 ? "No companies yet" : "No companies match your search"}
          description={companies.length === 0 ? "Add companies to group clients and leads by organization." : undefined}
          action={companies.length === 0 ? <Button onClick={() => setDialogOpen(true)}>Add company</Button> : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.industry ?? "—"}</TableCell>
                <TableCell>{company.size ?? "—"}</TableCell>
                <TableCell>
                  {company.website ? (
                    <Link href={company.website} target="_blank" className="text-primary hover:underline">
                      {company.website}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="ghost" size="icon" aria-label="Company actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onSelect={() => {
                          setEditing(company);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem onSelect={() => handleDelete(company)} className="text-danger">
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {organizationId && (
        <CompanyFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} organizationId={organizationId} company={editing} />
      )}
    </div>
  );
}
