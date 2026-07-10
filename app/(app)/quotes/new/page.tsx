import { PageHeader } from "@/components/layout/PageHeader";
import { QuoteForm } from "@/components/quotes/QuoteForm";

export default function NewQuotePage() {
  return (
    <div>
      <PageHeader title="New quote" description="Fill in the details below to create a quote." />
      <QuoteForm />
    </div>
  );
}
