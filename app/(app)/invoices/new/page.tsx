import { PageHeader } from "@/components/layout/PageHeader";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <div>
      <PageHeader title="New invoice" description="Fill in the details below to create an invoice." />
      <InvoiceForm />
    </div>
  );
}
