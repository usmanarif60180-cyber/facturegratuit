import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
