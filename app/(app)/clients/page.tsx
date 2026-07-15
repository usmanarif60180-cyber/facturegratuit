"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { useClients } from "@/hooks/useClients";
import { clientService } from "@/lib/services/clientService";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import type { Client } from "@/types";

export default function ClientsPage() {
  const { items: clients, loading, organizationId } = useClients();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(searchParams.get("new") === "1");
  const [editing, setEditing] = React.useState<Client | null>(null);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.displayName.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.companyName?.toLowerCase().includes(q) ||
      c.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  async function handleDelete(client: Client) {
    if (!organizationId) return;
    await clientService.remove(organizationId, client.id);
    toast({ variant: "success", title: "Client removed" });
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage every customer relationship in one place."
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" /> Add client
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-border">
          <TableSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration="client-management"
          title={clients.length === 0 ? "No clients yet" : "No clients match your search"}
          description={clients.length === 0 ? "Add your first client to get started." : undefined}
          action={
            clients.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>Add client</Button>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Link href={`/clients/${client.id}`} className="font-medium text-primary">
                    {client.displayName}
                  </Link>
                </TableCell>
                <TableCell>{client.companyName ?? "—"}</TableCell>
                <TableCell>{client.email ?? "—"}</TableCell>
                <TableCell>{client.phone ?? "—"}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="ghost" size="icon" aria-label="Client actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onSelect={() => {
                          setEditing(client);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem onSelect={() => handleDelete(client)} className="text-danger">
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
        <ClientFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          organizationId={organizationId}
          client={editing}
        />
      )}
    </div>
  );
}
