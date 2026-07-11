import type { DocumentSectionId } from "@/types/design";

export interface IndustryPreset {
  id: string;
  name: string;
  templateId: string;
  itemsLabel: string;
  suggestedPaymentTerms: string;
  suggestedNotes: string;
  enabledSections: DocumentSectionId[];
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  { id: "construction", name: "Construction", templateId: "construction-orange", itemsLabel: "Materials & Labor", suggestedPaymentTerms: "50% deposit due to begin work, balance due upon completion.", suggestedNotes: "All work performed to code and inspected on completion.", enabledSections: ["paymentDetails", "bankInfo", "signature"] },
  { id: "electrician", name: "Electrician", templateId: "construction-orange", itemsLabel: "Labor & Parts", suggestedPaymentTerms: "Payment due within 14 days of completion.", suggestedNotes: "Warranty covers labor for 12 months from completion date.", enabledSections: ["paymentDetails", "bankInfo"] },
  { id: "plumber", name: "Plumber", templateId: "construction-orange", itemsLabel: "Labor & Materials", suggestedPaymentTerms: "Payment due within 14 days of completion.", suggestedNotes: "Emergency call-out fees are non-refundable.", enabledSections: ["paymentDetails", "bankInfo"] },
  { id: "painter", name: "Painter", templateId: "construction-orange", itemsLabel: "Labor & Supplies", suggestedPaymentTerms: "30% deposit, balance due on completion.", suggestedNotes: "Touch-ups within 30 days included at no charge.", enabledSections: ["paymentDetails", "bankInfo"] },
  { id: "carpenter", name: "Carpenter", templateId: "construction-orange", itemsLabel: "Materials & Craftsmanship", suggestedPaymentTerms: "50% deposit, balance due upon completion.", suggestedNotes: "Custom work is measured and confirmed before fabrication.", enabledSections: ["paymentDetails", "bankInfo", "signature"] },
  { id: "mechanic", name: "Mechanic", templateId: "automotive-black", itemsLabel: "Parts & Labor", suggestedPaymentTerms: "Payment due upon vehicle collection.", suggestedNotes: "Parts warranty as per manufacturer terms.", enabledSections: ["paymentDetails"] },
  { id: "freelancer", name: "Freelancer", templateId: "freelancer-violet", itemsLabel: "Services Rendered", suggestedPaymentTerms: "Payment due within 14 days of receipt.", suggestedNotes: "Thank you for the opportunity to work together.", enabledSections: ["paymentDetails"] },
  { id: "consultant", name: "Consultant", templateId: "consulting-navy", itemsLabel: "Consulting Services", suggestedPaymentTerms: "Net 30.", suggestedNotes: "Rates as agreed in the signed statement of work.", enabledSections: ["paymentDetails", "bankInfo"] },
  { id: "agency", name: "Agency", templateId: "agency-sunset", itemsLabel: "Deliverables", suggestedPaymentTerms: "50% upfront, 50% on delivery.", suggestedNotes: "Includes two rounds of revisions unless otherwise agreed.", enabledSections: ["paymentDetails"] },
  { id: "lawFirm", name: "Law Firm", templateId: "legal-black", itemsLabel: "Legal Services", suggestedPaymentTerms: "Payment due within 30 days of invoice date.", suggestedNotes: "Fees billed per the engagement letter on file.", enabledSections: ["paymentDetails", "bankInfo", "signature"] },
  { id: "doctor", name: "Doctor / Clinic", templateId: "healthcare-emerald", itemsLabel: "Medical Services", suggestedPaymentTerms: "Payment due at time of service.", suggestedNotes: "Insurance claims are the patient's responsibility unless billed directly.", enabledSections: ["paymentDetails"] },
  { id: "restaurant", name: "Restaurant", templateId: "restaurant-forest", itemsLabel: "Items", suggestedPaymentTerms: "Due upon receipt.", suggestedNotes: "Thank you for dining with us.", enabledSections: [] },
  { id: "retailShop", name: "Retail Shop", templateId: "retail-orange", itemsLabel: "Products", suggestedPaymentTerms: "Due upon receipt.", suggestedNotes: "Returns accepted within 14 days with receipt.", enabledSections: [] },
  { id: "ecommerce", name: "E-commerce", templateId: "startup-emerald", itemsLabel: "Order Items", suggestedPaymentTerms: "Paid online at checkout.", suggestedNotes: "This receipt confirms your order — thank you for shopping with us.", enabledSections: ["qrCode"] },
  { id: "beautySalon", name: "Beauty Salon", templateId: "beauty-orchid", itemsLabel: "Services", suggestedPaymentTerms: "Due at time of service.", suggestedNotes: "Book your next appointment with us soon!", enabledSections: [] },
  { id: "cleaningCompany", name: "Cleaning Company", templateId: "professional-ocean", itemsLabel: "Cleaning Services", suggestedPaymentTerms: "Payment due within 7 days of service.", suggestedNotes: "Recurring service discounts available on request.", enabledSections: ["paymentDetails", "bankInfo"] },
  { id: "architecture", name: "Architecture", templateId: "architecture-slate", itemsLabel: "Design Services", suggestedPaymentTerms: "Billed per project milestone.", suggestedNotes: "Drawings remain our intellectual property until paid in full.", enabledSections: ["paymentDetails", "signature"] },
  { id: "engineering", name: "Engineering", templateId: "engineering-blueprint", itemsLabel: "Engineering Services", suggestedPaymentTerms: "Net 30.", suggestedNotes: "Deliverables subject to the signed scope of work.", enabledSections: ["paymentDetails", "signature"] },
  { id: "photography", name: "Photography", templateId: "elegant-plum", itemsLabel: "Packages & Prints", suggestedPaymentTerms: "50% deposit to book, balance due before delivery.", suggestedNotes: "Full-resolution files delivered after final payment.", enabledSections: ["watermark", "paymentDetails"] },
  { id: "itServices", name: "IT Services", templateId: "technology-noir", itemsLabel: "Technical Services", suggestedPaymentTerms: "Net 15.", suggestedNotes: "Support hours logged and billed in 15-minute increments.", enabledSections: ["paymentDetails", "bankInfo"] },
];

export function getIndustryPreset(id: string): IndustryPreset | undefined {
  return INDUSTRY_PRESETS.find((i) => i.id === id);
}
