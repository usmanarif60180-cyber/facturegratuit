import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { RESOURCE_ITEMS } from "@/lib/content/resources/items";

export function FeaturedTemplates() {
  const featured = RESOURCE_ITEMS.filter((r) => r.kind !== "checklist").slice(0, 4);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Featured templates</h2>
        <Link href="/resources" className="text-sm font-semibold text-primary hover:underline">
          Browse all resources
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((resource) => (
          <Link key={resource.slug} href={`/resources/${resource.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-elevated">
              <CardContent className="pt-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold">{resource.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
