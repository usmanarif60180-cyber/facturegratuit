import type { CSSProperties, ReactNode } from "react";
import { DOCUMENT_STYLE_KNOBS } from "@/lib/design/documentStyles";
import { fontCssVar } from "@/lib/design/fonts";
import { getDocumentDictionary } from "@/lib/i18n/documentDictionary";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { DesignableDocumentData, DesignableStatus } from "@/lib/design/documentAdapter";
import type { BrandKit, DesignConfig, DocumentSectionId } from "@/types/design";
import type { Client, Organization } from "@/types";

interface DesignableDocumentProps {
  doc: DesignableDocumentData;
  client: Client | null;
  organization: Organization | null;
  design: DesignConfig;
  brandKit?: BrandKit | null;
  locale?: string;
  className?: string;
}

const ROW_HEIGHT_PADDING: Record<DesignConfig["table"]["rowHeight"], string> = {
  compact: "0.35rem",
  comfortable: "0.6rem",
  spacious: "0.95rem",
};

const SPACING_GAP: Record<DesignConfig["spacing"], string> = {
  compact: "1.1rem",
  normal: "1.75rem",
  relaxed: "2.5rem",
};

const PAGE_PADDING: Record<DesignConfig["spacing"], string> = {
  compact: "1.75rem",
  normal: "2.75rem",
  relaxed: "3.5rem",
};

const CORNER_RADIUS: Record<"none" | "sm" | "lg", string> = { none: "0px", sm: "8px", lg: "18px" };

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

function statusColor(status: DesignableStatus, palette: DesignConfig["palette"]): string {
  if (status === "paid" || status === "accepted" || status === "converted") return palette.statusPaid;
  if (status === "overdue" || status === "declined" || status === "expired") return palette.statusOverdue;
  if (status === "pending" || status === "sent") return palette.statusPending;
  return palette.muted;
}

function DividerLine({ style, color }: { style: "line" | "double" | "dotted" | "none"; color: string }) {
  if (style === "none") return null;
  if (style === "double") {
    return (
      <div style={{ marginTop: "0.35rem" }}>
        <div style={{ height: 2, background: color }} />
        <div style={{ height: 1, background: color, marginTop: 3, opacity: 0.5 }} />
      </div>
    );
  }
  return (
    <div
      style={{
        borderTop: `1px ${style === "dotted" ? "dotted" : "solid"} ${color}`,
        opacity: style === "dotted" ? 0.7 : 0.4,
      }}
    />
  );
}

export function DesignableDocument({
  doc,
  client,
  organization,
  design,
  brandKit,
  locale = "en",
  className,
}: DesignableDocumentProps) {
  const { palette, typography, table, page } = design;
  const knobs = DOCUMENT_STYLE_KNOBS[design.documentStyle];
  const t = getDocumentDictionary(locale);
  const visibleSections = design.sections.filter((s) => s.visible).map((s) => s.id);
  const watermarkVisible = visibleSections.includes("watermark");
  const bodySections = visibleSections.filter((id) => id !== "watermark");

  const pageBg = palette.footerBg;
  const headerIsDark = isDarkColor(palette.headerBg);
  const headerTextColor = headerIsDark ? "#FFFFFF" : palette.text;

  const bodyStyle: CSSProperties = {
    fontFamily: fontCssVar(typography.bodyFont),
    fontWeight: typography.bodyWeight,
    fontSize: typography.baseFontSize,
    lineHeight: typography.lineHeight,
    letterSpacing: `${typography.letterSpacing}em`,
    color: palette.text,
    background: pageBg,
  };

  const headingStyle: CSSProperties = {
    fontFamily: fontCssVar(typography.headingFont),
    fontWeight: typography.headingWeight,
  };

  const tableFontStyle: CSSProperties = { fontFamily: fontCssVar(typography.tableFont) };
  const footerFontStyle: CSSProperties = { fontFamily: fontCssVar(typography.footerFont) };

  function SectionLabel({ children }: { children: ReactNode }) {
    return (
      <p
        style={{ color: palette.muted, fontSize: typography.baseFontSize * 0.72, letterSpacing: "0.06em" }}
        className="font-semibold uppercase"
      >
        {children}
      </p>
    );
  }

  function renderCompanyBlock() {
    return (
      <div key="companyBlock" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <SectionLabel>{organization?.name ? "From" : "Your business"}</SectionLabel>
        <p className="mt-1 font-medium" style={headingStyle}>{organization?.name ?? "Your Business"}</p>
        {organization?.email && <p style={{ color: palette.muted }} className="text-sm">{organization.email}</p>}
        {organization?.address?.city && <p style={{ color: palette.muted }} className="text-sm">{organization.address.city}</p>}
      </div>
    );
  }

  function renderClientBlock() {
    return (
      <div key="clientBlock" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <SectionLabel>{doc.kind === "invoice" ? t.billedTo : t.quoteFor}</SectionLabel>
        <p className="mt-1 font-medium">{client?.displayName ?? "—"}</p>
        {client?.email && <p style={{ color: palette.muted }} className="text-sm">{client.email}</p>}
        {client?.address?.city && <p style={{ color: palette.muted }} className="text-sm">{client.address.city}</p>}
      </div>
    );
  }

  function renderDocInfo() {
    return (
      <div key="docInfo" className="grid grid-cols-2 gap-4" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <div>
          <SectionLabel>{t.issueDate}</SectionLabel>
          <p className="mt-1 text-sm">{formatDate(doc.issueDate, locale)}</p>
        </div>
        <div>
          <SectionLabel>{doc.secondDateLabel === "dueDate" ? t.dueDate : t.validUntil}</SectionLabel>
          <p className="mt-1 text-sm">{formatDate(doc.secondDate, locale)}</p>
        </div>
      </div>
    );
  }

  function renderItemsTable() {
    const radius = table.style === "rounded" ? "12px" : table.style === "luxury" ? "2px" : "0px";
    const headerBorder =
      table.headerStyle === "filled"
        ? { background: palette.tableHeaderBg }
        : table.headerStyle === "outline"
          ? { border: `${table.borderThickness || 1}px solid ${palette.border}` }
          : { borderBottom: `2px solid ${palette.primary}` };

    return (
      <div key="itemsTable" style={{ marginBottom: SPACING_GAP[design.spacing], ...tableFontStyle }}>
        <table className="w-full text-sm" style={{ borderRadius: radius, overflow: "hidden" }}>
          <thead>
            <tr style={{ textAlign: "left", ...headerBorder }}>
              {[t.description, t.qty, t.unitPrice, t.amount].map((label, i) => (
                <th
                  key={label}
                  className={cn("font-semibold uppercase", i > 0 && "text-right")}
                  style={{
                    padding: `${ROW_HEIGHT_PADDING[table.rowHeight]} 0.75rem`,
                    fontSize: typography.baseFontSize * 0.72,
                    letterSpacing: "0.05em",
                    color: table.headerStyle === "filled" ? palette.text : palette.muted,
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc.lineItems.map((item, i) => (
              <tr
                key={item.id}
                style={{
                  background: table.alternatingRows && i % 2 === 1 ? palette.tableHeaderBg : "transparent",
                  borderTop: table.borderThickness > 0 ? `${table.borderThickness}px solid ${palette.border}` : `1px solid ${palette.border}55`,
                }}
              >
                <td style={{ padding: `${ROW_HEIGHT_PADDING[table.rowHeight]} 0.75rem` }}>{item.description || "—"}</td>
                <td className="text-right" style={{ padding: `${ROW_HEIGHT_PADDING[table.rowHeight]} 0.75rem` }}>{item.quantity}</td>
                <td className="text-right" style={{ padding: `${ROW_HEIGHT_PADDING[table.rowHeight]} 0.75rem` }}>
                  {formatCurrency(item.unitPrice, doc.currency, locale)}
                </td>
                <td className="text-right font-medium" style={{ padding: `${ROW_HEIGHT_PADDING[table.rowHeight]} 0.75rem` }}>
                  {formatCurrency(item.quantity * item.unitPrice, doc.currency, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderTaxSection() {
    return (
      <div key="taxSection" className="ml-auto flex w-full max-w-xs flex-col gap-1.5 text-sm" style={{ marginBottom: "0.5rem" }}>
        <div className="flex justify-between" style={{ color: palette.muted }}>
          <span>{t.subtotal}</span>
          <span>{formatCurrency(doc.totals.subtotal, doc.currency, locale)}</span>
        </div>
        <div className="flex justify-between" style={{ color: palette.muted }}>
          <span>{t.discount}</span>
          <span>-{formatCurrency(doc.totals.discountTotal, doc.currency, locale)}</span>
        </div>
        <div className="flex justify-between" style={{ color: palette.muted }}>
          <span>{t.tax}</span>
          <span>{formatCurrency(doc.totals.taxTotal, doc.currency, locale)}</span>
        </div>
      </div>
    );
  }

  function renderSummary() {
    return (
      <div key="summary" className="ml-auto flex w-full max-w-xs flex-col gap-1.5 text-sm" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <div className="flex justify-between text-base font-semibold" style={{ borderTop: `1px solid ${palette.border}`, paddingTop: "0.4rem", ...headingStyle }}>
          <span>{t.total}</span>
          <span style={{ color: palette.primary }}>{formatCurrency(doc.totals.total, doc.currency, locale)}</span>
        </div>
        {typeof doc.totals.amountDue === "number" && (
          <div className="flex justify-between" style={{ color: palette.muted }}>
            <span>{t.amountDue}</span>
            <span>{formatCurrency(doc.totals.amountDue, doc.currency, locale)}</span>
          </div>
        )}
      </div>
    );
  }

  function renderPaymentDetails() {
    if (!brandKit?.defaultPaymentTerms) return null;
    return (
      <div key="paymentDetails" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <SectionLabel>{t.paymentDetails}</SectionLabel>
        <p className="mt-1 whitespace-pre-wrap text-sm" style={{ color: palette.muted }}>{brandKit.defaultPaymentTerms}</p>
      </div>
    );
  }

  function renderBankInfo() {
    const bank = brandKit?.bank;
    if (!bank || (!bank.accountName && !bank.accountNumber && !bank.bankName && !bank.iban)) return null;
    const rows: [string, string | undefined][] = [
      [t.accountName, bank.accountName],
      [t.accountNumber, bank.accountNumber],
      [t.bankName, bank.bankName],
      [t.iban, bank.iban],
      [t.swift, bank.swift],
    ];
    return (
      <div key="bankInfo" className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <SectionLabel><span className="col-span-2">{t.bankInformation}</span></SectionLabel>
        {rows.filter(([, v]) => v).map(([label, value]) => (
          <div key={label} className="col-span-2 flex justify-between border-b py-1" style={{ borderColor: `${palette.border}88` }}>
            <span style={{ color: palette.muted }}>{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  function renderQrCode() {
    if (!doc.qrCodeUrl) return null;
    return (
      <div key="qrCode" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={doc.qrCodeUrl} alt="Payment QR code" className="h-24 w-24" />
      </div>
    );
  }

  function renderNotes() {
    if (!doc.notes) return null;
    return (
      <div key="notes" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <SectionLabel>{t.notes}</SectionLabel>
        <p className="mt-1 whitespace-pre-wrap text-sm" style={{ color: palette.muted }}>{doc.notes}</p>
      </div>
    );
  }

  function renderTerms() {
    if (!doc.terms) return null;
    return (
      <div key="terms" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        <SectionLabel>{t.terms}</SectionLabel>
        <p className="mt-1 whitespace-pre-wrap text-sm" style={{ color: palette.muted }}>{doc.terms}</p>
      </div>
    );
  }

  function renderSignature() {
    return (
      <div key="signature" className="flex flex-col items-start" style={{ marginBottom: SPACING_GAP[design.spacing] }}>
        {doc.signatureUrl || brandKit?.signatureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={(doc.signatureUrl || brandKit?.signatureUrl) ?? undefined} alt="Signature" className="h-12" />
        ) : (
          <div style={{ width: 180, borderBottom: `1px solid ${palette.border}`, height: 40 }} />
        )}
        <p className="mt-1 text-xs" style={{ color: palette.muted }}>{t.authorizedSignature}</p>
      </div>
    );
  }

  function renderStamp() {
    if (!brandKit?.stampText) return null;
    return (
      <div
        key="stamp"
        className="flex h-20 w-20 rotate-[-8deg] items-center justify-center rounded-full text-center text-[10px] font-bold uppercase"
        style={{ border: `2px solid ${palette.primary}`, color: palette.primary }}
      >
        {brandKit.stampText}
      </div>
    );
  }

  const SECTION_RENDERERS: Record<Exclude<DocumentSectionId, "watermark">, () => ReactNode> = {
    companyBlock: renderCompanyBlock,
    clientBlock: renderClientBlock,
    docInfo: renderDocInfo,
    itemsTable: renderItemsTable,
    taxSection: renderTaxSection,
    summary: renderSummary,
    paymentDetails: renderPaymentDetails,
    bankInfo: renderBankInfo,
    qrCode: renderQrCode,
    notes: renderNotes,
    terms: renderTerms,
    signature: renderSignature,
    stamp: renderStamp,
  };

  const title = doc.kind === "invoice" ? t.invoiceTitle : t.quoteTitle;
  const pageMargin = page.margin === "narrow" ? "10mm" : page.margin === "wide" ? "25mm" : "16mm";
  const pageSizeName = page.size === "a4" ? "A4" : "letter";

  return (
    <div
      id="print-area"
      data-page-size={page.size}
      data-page-orientation={page.orientation}
      data-repeat-header={page.repeatHeader}
      className={cn("relative overflow-hidden rounded-xl border shadow-card", className)}
      style={{ ...bodyStyle, borderColor: palette.border, borderRadius: CORNER_RADIUS[knobs.cornerRadius] }}
    >
      {/* Real @page rules — honored by "Print to PDF", giving genuine A4/Letter
       * + orientation + margin control without any PDF library. Note: Chrome
       * does not implement @page margin-box counters, so "Page X of Y" stays
       * a best-effort static footer rather than a fabricated live counter. */}
      <style dangerouslySetInnerHTML={{ __html: `@media print { @page { size: ${pageSizeName} ${page.orientation}; margin: ${pageMargin}; } }` }} />

      {watermarkVisible && design.watermarkText && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          style={{ zIndex: 0 }}
        >
          <span style={{ fontSize: 96, fontWeight: 800, color: palette.primary, opacity: 0.06, transform: "rotate(-28deg)", whiteSpace: "nowrap", ...headingStyle }}>
            {design.watermarkText}
          </span>
        </div>
      )}

      {knobs.accentBar === "top" && <div style={{ height: 6, background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})` }} />}

      <div className="relative flex" style={{ zIndex: 1 }}>
        {knobs.accentBar === "left" && <div style={{ width: 8, background: palette.primary, flexShrink: 0 }} />}
        <div className="min-w-0 flex-1" style={{ padding: PAGE_PADDING[design.spacing] }}>
          <div
            style={{ background: headerIsDark ? palette.headerBg : "transparent", color: headerTextColor, margin: headerIsDark ? `-${PAGE_PADDING[design.spacing]} -${PAGE_PADDING[design.spacing]} 0` : undefined, padding: headerIsDark ? PAGE_PADDING[design.spacing] : undefined }}
          >
            <div
              className={cn(
                "flex gap-6",
                knobs.headerAlign === "split" && "flex-col justify-between sm:flex-row sm:items-start",
                knobs.headerAlign === "stacked" && "flex-col items-start",
                knobs.headerAlign === "centered" && "flex-col items-center text-center"
              )}
            >
              <div
                className={cn(
                  knobs.headerAlign !== "split" && design.logoPosition === "center" && "self-center",
                  knobs.headerAlign !== "split" && design.logoPosition === "right" && "self-end"
                )}
              >
                {organization?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={organization.logoUrl} alt={organization.name} className="mb-2 h-10" />
                ) : (
                  <h2 className="text-xl font-bold" style={headingStyle}>{organization?.name ?? "Your Business"}</h2>
                )}
              </div>
              <div className={knobs.headerAlign === "centered" ? "" : "sm:text-right"}>
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{ ...headingStyle, textTransform: knobs.titleTransform === "none" ? undefined : knobs.titleTransform }}
                >
                  {title}
                </h1>
                <p className="text-sm" style={{ color: headerIsDark ? "#FFFFFFAA" : palette.muted }}>{doc.number}</p>
                <span
                  className="mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                  style={{ background: `${statusColor(doc.status, palette)}22`, color: statusColor(doc.status, palette) }}
                >
                  {doc.status}
                </span>
              </div>
            </div>
            <div style={{ marginTop: "1.25rem" }}>
              <DividerLine style={knobs.divider} color={headerIsDark ? "#FFFFFF" : palette.border} />
            </div>
          </div>

          <div style={{ marginTop: SPACING_GAP[design.spacing] }}>
            {bodySections.map((id) => (
              <div key={id}>{SECTION_RENDERERS[id]?.()}</div>
            ))}
          </div>

          {design.footerVisible && (
            <div
              className="flex items-center justify-between border-t pt-4 text-xs"
              style={{ marginTop: SPACING_GAP[design.spacing], borderColor: palette.border, color: palette.muted, ...footerFontStyle }}
            >
              <span>{design.footerText || t.thankYou}</span>
              {page.pageNumbers && (
                <span>
                  {t.page} 1 {t.of} 1
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
