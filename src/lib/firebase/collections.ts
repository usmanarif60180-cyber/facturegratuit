/**
 * Central registry of Firestore collection names/paths. Import from here
 * instead of hardcoding string literals so the schema stays discoverable
 * and refactor-safe as new modules (CRM, Inventory, Projects, ...) land.
 */
export const COLLECTIONS = {
  users: "users",
  organizations: "organizations",
  clients: "clients",
  products: "products",
  invoices: "invoices",
  quotes: "quotes",
  expenses: "expenses",
  subscriptions: "subscriptions",
  notifications: "notifications",
  activityLogs: "activity_logs",
  savedDesigns: "saved_designs",
} as const;

export function orgScoped(collection: string, organizationId: string) {
  return `organizations/${organizationId}/${collection}`;
}
