import type { Template } from "@/types/design";
import { buildDesignConfig } from "./defaults";

interface TemplateSeed {
  id: string;
  name: string;
  category: Template["category"];
  description: string;
  documentStyle: Parameters<typeof buildDesignConfig>[0]["documentStyle"];
  paletteId: string;
  tableStyle: Parameters<typeof buildDesignConfig>[0]["tableStyle"];
  headingFont: Parameters<typeof buildDesignConfig>[0]["headingFont"];
  bodyFont: Parameters<typeof buildDesignConfig>[0]["bodyFont"];
}

const SEEDS: TemplateSeed[] = [
  { id: "modern-blue", name: "Modern Blue", category: "modern", description: "Bold accent bar, rounded table, confident sans type.", documentStyle: "modern", paletteId: "royal-blue", tableStyle: "rounded", headingFont: "poppins", bodyFont: "inter" },
  { id: "minimal-white", name: "Minimal White", category: "minimal", description: "Almost no ornament — just clean type and whitespace.", documentStyle: "minimal", paletteId: "white-minimal", tableStyle: "minimal", headingFont: "workSans", bodyFont: "workSans" },
  { id: "executive-navy", name: "Executive Navy", category: "executive", description: "Deep navy header band with a corporate table.", documentStyle: "executive", paletteId: "navy", tableStyle: "corporate", headingFont: "ibmPlexSans", bodyFont: "ibmPlexSans" },
  { id: "corporate-gray", name: "Corporate Gray", category: "corporate", description: "Structured, double-divided, built for large organizations.", documentStyle: "corporate", paletteId: "business-gray", tableStyle: "corporate", headingFont: "sourceSansPro", bodyFont: "sourceSansPro" },
  { id: "professional-ocean", name: "Professional Ocean", category: "professional", description: "Balanced and dependable — a safe default for any business.", documentStyle: "professional", paletteId: "ocean-blue", tableStyle: "clean", headingFont: "inter", bodyFont: "inter" },
  { id: "elegant-plum", name: "Elegant Plum", category: "elegant", description: "Centered header, dotted dividers, refined purple accents.", documentStyle: "elegant", paletteId: "modern-purple", tableStyle: "luxury", headingFont: "dmSans", bodyFont: "lato" },
  { id: "luxury-gold-classic", name: "Luxury Gold Classic", category: "luxury", description: "Dark header, gold accents, spacious luxury table.", documentStyle: "luxury", paletteId: "luxury-gold", tableStyle: "luxury", headingFont: "montserrat", bodyFont: "lato" },
  { id: "technology-noir", name: "Technology Noir", category: "technology", description: "High-contrast black header, minimal table, geometric type.", documentStyle: "technology", paletteId: "midnight-black", tableStyle: "minimal", headingFont: "geist", bodyFont: "geist" },
  { id: "construction-orange", name: "Construction Orange", category: "construction", description: "Heavy borders and a bold top accent bar for job-site trades.", documentStyle: "construction", paletteId: "sunset-orange", tableStyle: "bordered", headingFont: "workSans", bodyFont: "workSans" },
  { id: "architecture-slate", name: "Architecture Slate", category: "architecture", description: "Grid-like precision with restrained gray tones.", documentStyle: "minimal", paletteId: "business-gray", tableStyle: "minimal", headingFont: "ibmPlexSans", bodyFont: "ibmPlexSans" },
  { id: "engineering-blueprint", name: "Engineering Blueprint", category: "engineering", description: "Bordered table and left accent bar, technical and precise.", documentStyle: "technology", paletteId: "business-gray", tableStyle: "bordered", headingFont: "roboto", bodyFont: "roboto" },
  { id: "freelancer-violet", name: "Freelancer Violet", category: "freelancer", description: "Friendly, creative, striped table for solo practitioners.", documentStyle: "creative", paletteId: "modern-purple", tableStyle: "striped", headingFont: "poppins", bodyFont: "poppins" },
  { id: "agency-sunset", name: "Agency Sunset", category: "agency", description: "Energetic stacked header for creative agencies.", documentStyle: "creative", paletteId: "sunset-orange", tableStyle: "rounded", headingFont: "montserrat", bodyFont: "montserrat" },
  { id: "startup-emerald", name: "Startup Emerald", category: "startup", description: "Fresh, rounded, optimistic — built for young companies.", documentStyle: "modern", paletteId: "emerald", tableStyle: "rounded", headingFont: "dmSans", bodyFont: "dmSans" },
  { id: "consulting-navy", name: "Consulting Navy", category: "consulting", description: "Authoritative and understated for advisory firms.", documentStyle: "executive", paletteId: "navy", tableStyle: "clean", headingFont: "sourceSansPro", bodyFont: "sourceSansPro" },
  { id: "retail-orange", name: "Retail Orange", category: "retail", description: "Warm, striped rows, easy to scan at the counter.", documentStyle: "modern", paletteId: "sunset-orange", tableStyle: "striped", headingFont: "nunito", bodyFont: "nunito" },
  { id: "restaurant-forest", name: "Restaurant Forest", category: "restaurant", description: "Comfortable spacing, warm green, inviting for hospitality.", documentStyle: "creative", paletteId: "forest-green", tableStyle: "comfortable", headingFont: "lato", bodyFont: "lato" },
  { id: "automotive-black", name: "Automotive Black", category: "automotive", description: "Bordered and mechanical, for garages and dealerships.", documentStyle: "corporate", paletteId: "midnight-black", tableStyle: "bordered", headingFont: "roboto", bodyFont: "roboto" },
  { id: "healthcare-emerald", name: "Healthcare Emerald", category: "healthcare", description: "Calm, clean and trustworthy for clinics and practices.", documentStyle: "professional", paletteId: "emerald", tableStyle: "clean", headingFont: "openSans", bodyFont: "openSans" },
  { id: "beauty-orchid", name: "Beauty Orchid", category: "beauty", description: "Soft, elegant purple tones for salons and spas.", documentStyle: "elegant", paletteId: "modern-purple", tableStyle: "luxury", headingFont: "dmSans", bodyFont: "nunito" },
  { id: "education-blue", name: "Education Blue", category: "education", description: "Classic, legible, and welcoming for schools and tutors.", documentStyle: "classic", paletteId: "ocean-blue", tableStyle: "comfortable", headingFont: "openSans", bodyFont: "openSans" },
  { id: "logistics-navy", name: "Logistics Navy", category: "logistics", description: "Bordered table built for dense shipment line items.", documentStyle: "corporate", paletteId: "navy", tableStyle: "bordered", headingFont: "workSans", bodyFont: "workSans" },
  { id: "real-estate-gold", name: "Real Estate Gold", category: "realEstate", description: "Aspirational gold tones for agents and developers.", documentStyle: "executive", paletteId: "luxury-gold", tableStyle: "clean", headingFont: "montserrat", bodyFont: "montserrat" },
  { id: "legal-black", name: "Legal Black", category: "legal", description: "Formal, high-contrast, built for law firms.", documentStyle: "classic", paletteId: "midnight-black", tableStyle: "corporate", headingFont: "ibmPlexSans", bodyFont: "ibmPlexSans" },
  { id: "finance-gray", name: "Finance Gray", category: "finance", description: "Conservative and precise for accountants and advisors.", documentStyle: "executive", paletteId: "business-gray", tableStyle: "corporate", headingFont: "sourceSansPro", bodyFont: "sourceSansPro" },
  { id: "modern-emerald", name: "Modern Emerald", category: "modern", description: "A greener take on the modern accent-bar layout.", documentStyle: "modern", paletteId: "emerald", tableStyle: "rounded", headingFont: "geist", bodyFont: "geist" },
  { id: "minimal-black", name: "Minimal Black", category: "minimal", description: "Grayscale minimalism with a near-black accent.", documentStyle: "minimal", paletteId: "midnight-black", tableStyle: "minimal", headingFont: "inter", bodyFont: "inter" },
  { id: "corporate-navy", name: "Corporate Navy", category: "corporate", description: "A navy variant of the corporate double-divider layout.", documentStyle: "corporate", paletteId: "navy", tableStyle: "corporate", headingFont: "roboto", bodyFont: "roboto" },
  { id: "luxury-noir", name: "Luxury Noir", category: "luxury", description: "Dark, dramatic, and spacious for premium brands.", documentStyle: "luxury", paletteId: "midnight-black", tableStyle: "luxury", headingFont: "montserrat", bodyFont: "lato" },
  { id: "professional-dark-mode", name: "Professional Dark Mode", category: "professional", description: "A full dark-background document for modern digital brands.", documentStyle: "professional", paletteId: "professional-dark", tableStyle: "clean", headingFont: "inter", bodyFont: "inter" },
];

export const BUILTIN_TEMPLATES: Template[] = SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  category: seed.category,
  description: seed.description,
  isPremium: false,
  source: "builtin",
  design: buildDesignConfig({
    id: seed.id,
    name: seed.name,
    documentStyle: seed.documentStyle,
    paletteId: seed.paletteId,
    tableStyle: seed.tableStyle,
    headingFont: seed.headingFont,
    bodyFont: seed.bodyFont,
  }),
}));

export const TEMPLATE_CATEGORY_LABELS: Record<Template["category"], string> = {
  modern: "Modern",
  minimal: "Minimal",
  executive: "Executive",
  corporate: "Corporate",
  professional: "Professional",
  elegant: "Elegant",
  luxury: "Luxury",
  technology: "Technology",
  construction: "Construction",
  architecture: "Architecture",
  engineering: "Engineering",
  freelancer: "Freelancer",
  agency: "Agency",
  startup: "Startup",
  consulting: "Consulting",
  retail: "Retail",
  restaurant: "Restaurant",
  automotive: "Automotive",
  healthcare: "Healthcare",
  beauty: "Beauty",
  education: "Education",
  logistics: "Logistics",
  realEstate: "Real Estate",
  legal: "Legal",
  finance: "Finance",
};

export function getTemplate(id: string): Template | undefined {
  return BUILTIN_TEMPLATES.find((t) => t.id === id);
}
