"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceStatusBadge } from "@/components/shared/StatusBadge";
import { ContactsCard } from "@/components/crm/ContactsCard";
import { ContactPersonFormDialog } from "@/components/crm/ContactPersonFormDialog";
import { CustomerTimeline } from "@/components/crm/CustomerTimeline";
import { AiCustomerSummary } from "@/components/crm/AiCustomerSummary";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { clientService } from "@/lib/services/clientService";
import { invoiceService } from "@/lib/services/invoiceService";
import { contactPersonService } from "@/lib/services/contactPersonService";
import { where } from "@/lib/firebase/firestoreService";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Client, ContactPerson, CustomerStatus, Invoice } from "@/types";

const STATUS_OPTIONS: CustomerStatus[] = ["active", "prospect", "churned"];

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const { organization } = useOrganization();
  const { toast } = useToast();
  const organizationId = profile?.organizationId;

  const [client, setClient] = React.useState<Client | null>(null);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [contacts, setContacts] = React.useState<ContactPerson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tagInput, setTagInput] = React.useState("");
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<ContactPerson | null>(null);

  const load = React.useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    const [c, inv, cts] = await Promise.all([
      clientService.get(organizationId, params.id),
      invoiceService.list(organizationId, [where("clientId", "==", params.id)]),
      contactPersonService.list(organizationId, [where("clientId", "==", params.id)]),
    ]);
    setClient(c);
    setInvoices(inv);
    setContacts(cts);
    setLoading(false);
  }, [organizationId, params.id]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(status: CustomerStatus) {
    if (!organizationId || !client) return;
    await clientService.update(organizationId, client.id, { status });
    setClient({ ...client, status });
  }

  async function addTag(e: React.FormEvent) {
    e.preventDefault();
    if (!organizationId || !client || !tagInput.trim()) return;
    const tags = [...(client.tags ?? []), tagInput.trim()];
    await clientService.update(organizationId, client.id, { tags });
    setClient({ ...client, tags });
    setTagInput("");
  }

  async function removeTag(tag: string) {
    if (!organizationId || !client) return;
    const tags = (client.tags ?? []).filter((t) => t !== tag);
    await clientService.update(organizationId, client.id, { tags });
    setClient({ ...client, tags });
  }

  async function handleDeleteContact(contact: ContactPerson) {
    if (!organizationId) return;
    await contactPersonService.remove(organizationId, contact.id);
    toast({ variant: "success", title: "Contact removed" });
    load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return <p className="text-muted-foreground">Client not found.</p>;
  }

  const currency = organization?.settings.defaultCurrency ?? "USD";

  return (
    <div>
      <PageHeader
        title={client.displayName}
        description={client.companyName}
        action={
          <Button variant="outline" size="sm" onClick={() => router.push("/clients")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Status: </span>
                <Select
                  value={client.status ?? "active"}
                  onChange={(e) => updateStatus(e.target.value as CustomerStatus)}
                  className="mt-1 h-8 w-40 text-xs"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>
              <p>
                <span className="text-muted-foreground">Email: </span>
                {client.email ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Phone: </span>
                {client.phone ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">City: </span>
                {client.address?.city ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Country: </span>
                {client.address?.countryCode ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">VAT number: </span>
                {client.vatNumber ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Company number: </span>
                {client.companyNumber ?? "—"}
              </p>
              {client.notes && (
                <p className="pt-2">
                  <span className="text-muted-foreground">Notes: </span>
                  {client.notes}
                </p>
              )}
              <div className="pt-2">
                <span className="mb-1.5 block text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {(client.tags ?? []).map((tag) => (
                    <Badge key={tag} className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <form onSubmit={addTag} className="mt-2 flex gap-2">
                  <Input
                    placeholder="Add tag…"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button type="submit" size="sm" variant="outline">
                    Add
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <ContactsCard
            contacts={contacts}
            onAdd={() => {
              setEditingContact(null);
              setContactDialogOpen(true);
            }}
            onEdit={(contact) => {
              setEditingContact(contact);
              setContactDialogOpen(true);
            }}
            onDelete={handleDeleteContact}
          />

          <AiCustomerSummary client={client} invoices={invoices} currency={currency} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice history</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <EmptyState
                  illustration="invoice-generation"
                  title="No invoices yet"
                  description="Invoices sent to this client will appear here."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                        <TableCell>
                          <InvoiceStatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(invoice.totals.total, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {organizationId && <CustomerTimeline entityType="client" entityId={client.id} organizationId={organizationId} />}
        </div>
      </div>

      {organizationId && (
        <ContactPersonFormDialog
          open={contactDialogOpen}
          onClose={() => {
            setContactDialogOpen(false);
            load();
          }}
          organizationId={organizationId}
          clientId={client.id}
          contact={editingContact}
        />
      )}
    </div>
  );
}
