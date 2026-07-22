import type { Timestamps } from "./common";

export type FontId =
  | "inter"
  | "geist"
  | "roboto"
  | "poppins"
  | "montserrat"
  | "openSans"
  | "nunito"
  | "lato"
  | "sourceSansPro"
  | "ibmPlexSans"
  | "workSans"
  | "dmSans";

export type DocumentStyleId =
  | "classic"
  | "modern"
  | "corporate"
  | "elegant"
  | "luxury"
  | "executive"
  | "minimal"
  | "creative"
  | "construction"
  | "technology"
  | "professional";

export type TableStyleId =
  | "rounded"
  | "minimal"
  | "corporate"
  | "bordered"
  | "clean"
  | "luxury"
  | "striped"
  | "compact"
  | "comfortable";

export type DocumentSectionId =
  | "companyBlock"
  | "clientBlock"
  | "docInfo"
  | "itemsTable"
  | "taxSection"
  | "summary"
  | "paymentDetails"
  | "bankInfo"
  | "qrCode"
  | "notes"
  | "terms"
  | "signature"
  | "stamp"
  | "watermark";

export interface DocumentSectionConfig {
  id: DocumentSectionId;
  visible: boolean;
}

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  headerBg: string;
  footerBg: string;
  tableHeaderBg: string;
  border: string;
  icon: string;
  text: string;
  muted: string;
  statusPaid: string;
  statusPending: string;
  statusOverdue: string;
  isCustom?: boolean;
}

export interface TypographyConfig {
  headingFont: FontId;
  bodyFont: FontId;
  tableFont: FontId;
  footerFont: FontId;
  baseFontSize: number; // px, 11-16
  headingWeight: 500 | 600 | 700 | 800;
  bodyWeight: 400 | 500;
  lineHeight: number; // 1.2-1.8
  letterSpacing: number; // em, -0.01 to 0.06
}

export interface TableConfig {
  style: TableStyleId;
  borderThickness: 0 | 1 | 2;
  rowHeight: "compact" | "comfortable" | "spacious";
  headerStyle: "filled" | "outline" | "underline";
  alternatingRows: boolean;
}

export interface PageSetup {
  size: "a4" | "letter";
  orientation: "portrait" | "landscape";
  margin: "narrow" | "normal" | "wide";
  pageNumbers: boolean;
  repeatHeader: boolean;
}

export type LogoPosition = "left" | "center" | "right";
export type SpacingDensity = "compact" | "normal" | "relaxed";

export interface DesignConfig {
  id: string;
  name: string;
  documentStyle: DocumentStyleId;
  palette: ColorPalette;
  typography: TypographyConfig;
  table: TableConfig;
  page: PageSetup;
  sections: DocumentSectionConfig[];
  logoPosition: LogoPosition;
  spacing: SpacingDensity;
  footerVisible: boolean;
  footerText?: string;
  watermarkText?: string;
  isCustom?: boolean;
  updatedAt?: string;
}

export type TemplateCategory =
  | "modern"
  | "minimal"
  | "executive"
  | "corporate"
  | "professional"
  | "elegant"
  | "luxury"
  | "technology"
  | "construction"
  | "architecture"
  | "engineering"
  | "freelancer"
  | "agency"
  | "startup"
  | "consulting"
  | "retail"
  | "restaurant"
  | "automotive"
  | "healthcare"
  | "beauty"
  | "education"
  | "logistics"
  | "realEstate"
  | "legal"
  | "finance";

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  design: DesignConfig;
  isPremium?: boolean;
  source: "builtin" | "marketplace";
}

export interface BankDetails {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  swift?: string;
}

/** Reusable branding applied automatically to every future document. */
export interface BrandKit {
  signatureUrl?: string | null;
  stampText?: string;
  watermarkText?: string;
  bank?: BankDetails;
  defaultPaymentTerms?: string;
  defaultNotes?: string;
  defaultTerms?: string;
  activeDesignId?: string;
}

/** Per-user saved-design record (custom themes, favorites, recents). */
export interface SavedDesign extends Timestamps {
  id: string;
  organizationId: string;
  name: string;
  config: DesignConfig;
}

export interface DocumentStyleKnobs {
  headerAlign: "split" | "stacked" | "centered";
  accentBar: "top" | "left" | "none";
  titleTransform: "uppercase" | "capitalize" | "none";
  cornerRadius: "none" | "sm" | "lg";
  divider: "line" | "double" | "dotted" | "none";
}

export const DEFAULT_SECTION_ORDER: DocumentSectionId[] = [
  "companyBlock",
  "clientBlock",
  "docInfo",
  "itemsTable",
  "taxSection",
  "summary",
  "paymentDetails",
  "bankInfo",
  "qrCode",
  "notes",
  "terms",
  "signature",
  "stamp",
  "watermark",
];

export const SECTION_LABELS: Record<DocumentSectionId, string> = {
  companyBlock: "Company block",
  clientBlock: "Client block",
  docInfo: "Invoice information",
  itemsTable: "Items table",
  taxSection: "Tax section",
  summary: "Summary",
  paymentDetails: "Payment details",
  bankInfo: "Bank information",
  qrCode: "QR code",
  notes: "Notes",
  terms: "Terms & conditions",
  signature: "Signature",
  stamp: "Stamp",
  watermark: "Watermark",
};

/** Sections hidden by default — enabled per-organization via Brand Kit or per-template. */
const HIDDEN_BY_DEFAULT: DocumentSectionId[] = ["paymentDetails", "bankInfo", "qrCode", "signature", "stamp", "watermark"];

export function defaultSections(): DocumentSectionConfig[] {
  return DEFAULT_SECTION_ORDER.map((id) => ({ id, visible: !HIDDEN_BY_DEFAULT.includes(id) }));
}
