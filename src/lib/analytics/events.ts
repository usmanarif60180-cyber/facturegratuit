/**
 * Thin wrapper over gtag event tracking. No-ops when GA isn't configured or
 * when called during SSR, so call sites never need to guard themselves.
 */
export type AnalyticsEvent =
  | "sign_up"
  | "login"
  | "invoice_created"
  | "quote_created"
  | "quote_converted"
  | "newsletter_subscribed"
  | "tool_used"
  | "resource_viewed";

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, params);
  }
}
