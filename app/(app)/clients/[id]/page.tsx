"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceStatusBadge } from "@/components/shared/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/lib/services/clientService";
import { invoiceService } from "@/lib/services/invoiceService";
import { where } from "@/lib/firebase/firestoreService";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Client, Invoice } from "@/types";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();

  const [client, setClient] = React.useState<Client | null>(null);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.organizationId) return;
    (async () => {
      setLoading(true);
      const [c, inv] = await Promise.all([
        clientService.get(profile.organizationId, params.id),
        invoiceService.list(profile.organizationId, [where("clientId", "==", params.id)]),
      ]);
      setClient(c);
      setInvoices(inv);
      setLoading(false);
    })();
  }, [profile?.organizationId, params.id]);

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
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
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
      </div>
    </div>
  );
}
