import type { UserRole } from "@/types";

/**
 * Capability matrix for IVOXA's role model. This is architecture, not
 * enforcement: today only `owner`/`admin` vs. everyone-else vs. `viewer`
 * are actually checked (see firestore.rules `isOrgAdmin` / `canWrite`, and
 * every user is currently created with role "owner" — single-tenant-per-org
 * signup, no team invites yet). Once team invites ship, UI and rules can
 * consult `can()` below instead of re-deriving role logic ad hoc.
 */
export type PermissionCapability =
  | "manage_billing"
  | "manage_team"
  | "manage_organization"
  | "delete_records"
  | "create_edit_records"
  | "approve_expenses"
  | "view_financials"
  | "view_reports"
  | "export_data";

const ROLE_CAPABILITIES: Record<UserRole, PermissionCapability[]> = {
  owner: [
    "manage_billing",
    "manage_team",
    "manage_organization",
    "delete_records",
    "create_edit_records",
    "approve_expenses",
    "view_financials",
    "view_reports",
    "export_data",
  ],
  admin: [
    "manage_team",
    "manage_organization",
    "delete_records",
    "create_edit_records",
    "approve_expenses",
    "view_financials",
    "view_reports",
    "export_data",
  ],
  manager: ["create_edit_records", "approve_expenses", "view_financials", "view_reports", "export_data"],
  accountant: ["create_edit_records", "approve_expenses", "view_financials", "view_reports", "export_data"],
  employee: ["create_edit_records", "view_reports"],
  viewer: ["view_reports"],
};

export function can(role: UserRole, capability: PermissionCapability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  accountant: "Accountant",
  employee: "Employee",
  viewer: "Viewer",
};
