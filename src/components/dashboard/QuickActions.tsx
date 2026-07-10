import Link from "next/link";
import { FilePlus2, FileSpreadsheet, UserPlus, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const ACTIONS = [
  { href: "/invoices/new", label: "New invoice", icon: FilePlus2 },
  { href: "/quotes/new", label: "New quote", icon: FileSpreadsheet },
  { href: "/clients?new=1", label: "Add client", icon: UserPlus },
  { href: "/products?new=1", label: "Add product", icon: Package },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
          >
            <action.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            {action.label}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
