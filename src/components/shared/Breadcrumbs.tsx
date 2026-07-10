import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const withHome: BreadcrumbItem[] = [{ name: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
      {withHome.map((item, index) => {
        const isLast = index === withHome.length - 1;
        return (
          <span key={item.path} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="text-muted-foreground hover:text-foreground">
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
      <JsonLd data={breadcrumbSchema(withHome)} />
    </nav>
  );
}
