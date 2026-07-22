import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Users,
  Building2,
  Briefcase,
  Target,
  Package,
  Receipt,
  ListTodo,
  CalendarDays,
  BarChart3,
  Sparkles,
  Palette,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const APP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "CRM", href: "/crm", icon: Briefcase },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Quotes", href: "/quotes", icon: FileSpreadsheet },
  { label: "Design Studio", href: "/design-studio", icon: Palette },
  { label: "Products", href: "/products", icon: Package },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

export const APP_NAV_FOOTER: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];
