"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Loader2, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { invoiceService } from "@/lib/services/invoiceService";
import { clientService } from "@/lib/services/clientService";
import type { Client, Invoice, InvoiceStatus } from "@/types";

const STATUS_OPTIONS: InvoiceStatus[] = ["draft", "pending", "paid", "overdue", "canceled"];

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useAuth();
  const { organization } = useOrganization();
  const organizationId = profile?.organizationId;
  const invoiceId = params.id;

  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [client, setClient] = React.useState<Client | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    const inv = await invoiceService.get(organizationId, invoiceId);
    setInvoice(inv);
    if (inv) {
      setClient(await clientService.get(organizationId, inv.clientId));
    }
    setLoading(false);
  }, [organizationId, invoiceId]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(status: InvoiceStatus) {
    if (!profile?.organizationId || !invoice) return;
    await invoiceService.markStatus(profile.organizationId, invoice.id, status);
    toast({ variant: "success", title: `Marked as ${status}` });
    load();
  }

  async function handleDuplicate() {
    if (!profile?.organizationId || !invoice) return;
    const id = await invoiceService.duplicateInvoice(profile.organizationId, invoice);
    toast({ variant: "success", title: "Invoice duplicated" });
    router.push(`/invoices/${id}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return <p className="text-muted-foreground">Invoice not found.</p>;
  }

  return (
    <div>
      <PageHeader
        title={invoice.number}
        description="Review, print or update this invoice."
        action={
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => router.push("/invoices")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate} className="gap-2">
              <Copy className="h-4 w-4" /> Duplicate
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm">Update status</Button>
              </DropdownTrigger>
              <DropdownMenu>
                {STATUS_OPTIONS.map((status) => (
                  <DropdownItem key={status} onSelect={() => handleStatusChange(status)}>
                    Mark as {status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        }
      />
      <InvoicePreview invoice={invoice} client={client} organization={organization} />
    </div>
  );
}
