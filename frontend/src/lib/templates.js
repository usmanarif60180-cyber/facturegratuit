// Modular template configuration system
// One shared renderer, 50 template variants driven by config.

export const fontOptions = [
  { id: "inter", label: "Inter", family: "'Inter', sans-serif" },
  { id: "roboto", label: "Roboto", family: "'Roboto', sans-serif" },
  { id: "opensans", label: "Open Sans", family: "'Open Sans', sans-serif" },
  { id: "lato", label: "Lato", family: "'Lato', sans-serif" },
  { id: "montserrat", label: "Montserrat", family: "'Montserrat', sans-serif" },
  { id: "poppins", label: "Poppins", family: "'Poppins', sans-serif" },
  { id: "nunito", label: "Nunito Sans", family: "'Nunito Sans', sans-serif" },
  { id: "source", label: "Source Sans 3", family: "'Source Sans 3', sans-serif" },
  { id: "work", label: "Work Sans", family: "'Work Sans', sans-serif" },
  { id: "dmsans", label: "DM Sans", family: "'DM Sans', sans-serif" },
  { id: "raleway", label: "Raleway", family: "'Raleway', sans-serif" },
  { id: "ubuntu", label: "Ubuntu", family: "'Ubuntu', sans-serif" },
  { id: "merriweather", label: "Merriweather", family: "'Merriweather', serif" },
  { id: "libre", label: "Libre Baskerville", family: "'Libre Baskerville', serif" },
  { id: "playfair", label: "Playfair Display", family: "'Playfair Display', serif" },
  { id: "georgia", label: "Georgia", family: "Georgia, serif" },
  { id: "arial", label: "Arial", family: "Arial, sans-serif" },
  { id: "times", label: "Times", family: "'Times New Roman', serif" },
];

export const colorPalettes = [
  { id: "marine", name: "Marine", primary: "#0F172A", secondary: "#1E3A8A", accent: "#E2E8F0" },
  { id: "corporate", name: "Corporate Blue", primary: "#1D4ED8", secondary: "#2563EB", accent: "#EFF6FF" },
  { id: "luxury", name: "Luxury", primary: "#111111", secondary: "#B89545", accent: "#F5F5F4" },
  { id: "construction", name: "Construction", primary: "#1F2937", secondary: "#F59E0B", accent: "#FEF3C7" },
  { id: "automobile", name: "Automobile", primary: "#111827", secondary: "#DC2626", accent: "#F3F4F6" },
  { id: "eco", name: "Eco", primary: "#14532D", secondary: "#16A34A", accent: "#F0FDF4" },
  { id: "bordeaux", name: "Bordeaux", primary: "#7F1D1D", secondary: "#991B1B", accent: "#FEF2F2" },
  { id: "purple", name: "Violet Premium", primary: "#4C1D95", secondary: "#7C3AED", accent: "#F5F3FF" },
  { id: "orange", name: "Orange Moderne", primary: "#9A3412", secondary: "#EA580C", accent: "#FFF7ED" },
  { id: "turquoise", name: "Turquoise", primary: "#134E4A", secondary: "#0D9488", accent: "#F0FDFA" },
  { id: "mono", name: "Monochrome", primary: "#111827", secondary: "#374151", accent: "#F3F4F6" },
  { id: "rose", name: "Rose", primary: "#9F1239", secondary: "#E11D48", accent: "#FFF1F2" },
];

// header: "bar" | "logo-left" | "logo-center" | "logo-right" | "sidebar" | "minimal" | "band" | "corporate"
// table: "classic" | "minimal" | "colored" | "alt" | "borderless" | "rounded" | "compact" | "bold-totals"
// totals: "right" | "highlight" | "colored-box" | "minimal-lines" | "premium" | "full-width"
// title: "large" | "small" | "badge" | "underlined" | "colored" | "minimal" | "right"
// footer: "minimal" | "business" | "colored" | "legal" | "bank"
// density: "compact" | "standard" | "airy"

export const templates = [
  { id: "classique-fr", name: "Classique Français", category: "Classique", header: "logo-left", title: "large", table: "classic", totals: "right", footer: "business", density: "standard", palette: { primary: "#1E40AF", secondary: "#3B82F6", accent: "#EFF6FF" }, font: "inter" },
  { id: "moderne-bleu", name: "Moderne Bleu", category: "Moderne", header: "band", title: "badge", table: "colored", totals: "highlight", footer: "minimal", density: "airy", palette: { primary: "#2563EB", secondary: "#60A5FA", accent: "#EFF6FF" }, font: "montserrat" },
  { id: "minimal-blanc", name: "Minimal Blanc", category: "Minimal", header: "minimal", title: "minimal", table: "minimal", totals: "minimal-lines", footer: "minimal", density: "airy", palette: { primary: "#111827", secondary: "#6B7280", accent: "#F9FAFB" }, font: "dmsans" },
  { id: "elegant-noir", name: "Élégant Noir", category: "Premium", header: "logo-center", title: "underlined", table: "borderless", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#111827", secondary: "#374151", accent: "#F5F5F4" }, font: "playfair" },
  { id: "corporate", name: "Corporate", category: "Corporate", header: "corporate", title: "large", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#1E3A8A", secondary: "#3B82F6", accent: "#DBEAFE" }, font: "roboto" },
  { id: "pro-gris", name: "Professionnel Gris", category: "Corporate", header: "logo-left", title: "large", table: "alt", totals: "right", footer: "business", density: "standard", palette: { primary: "#374151", secondary: "#6B7280", accent: "#F3F4F6" }, font: "opensans" },
  { id: "premium-or", name: "Premium Or", category: "Premium", header: "band", title: "badge", table: "rounded", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#78350F", secondary: "#B89545", accent: "#FEF3C7" }, font: "libre" },
  { id: "noir-or", name: "Premium Noir & Or", category: "Premium", header: "band", title: "badge", table: "borderless", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#111111", secondary: "#B89545", accent: "#FAFAF9" }, font: "playfair" },
  { id: "bleu-marine", name: "Bleu Marine", category: "Classique", header: "logo-left", title: "large", table: "colored", totals: "colored-box", footer: "bank", density: "standard", palette: { primary: "#0F172A", secondary: "#1E3A8A", accent: "#E0E7FF" }, font: "inter" },
  { id: "bleu-clair", name: "Bleu Clair", category: "Moderne", header: "band", title: "badge", table: "alt", totals: "highlight", footer: "minimal", density: "standard", palette: { primary: "#0284C7", secondary: "#38BDF8", accent: "#E0F2FE" }, font: "poppins" },
  { id: "vert-business", name: "Vert Business", category: "Corporate", header: "logo-left", title: "large", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#166534", secondary: "#22C55E", accent: "#DCFCE7" }, font: "roboto" },
  { id: "vert-olive", name: "Vert Olive", category: "Classique", header: "logo-right", title: "small", table: "minimal", totals: "right", footer: "business", density: "standard", palette: { primary: "#365314", secondary: "#84CC16", accent: "#F7FEE7" }, font: "lato" },
  { id: "rouge-elegant", name: "Rouge Élégant", category: "Premium", header: "band", title: "underlined", table: "colored", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#991B1B", secondary: "#DC2626", accent: "#FEF2F2" }, font: "playfair" },
  { id: "bordeaux", name: "Bordeaux", category: "Premium", header: "logo-left", title: "large", table: "classic", totals: "colored-box", footer: "legal", density: "standard", palette: { primary: "#7F1D1D", secondary: "#991B1B", accent: "#FEF2F2" }, font: "merriweather" },
  { id: "orange-moderne", name: "Orange Moderne", category: "Moderne", header: "band", title: "badge", table: "alt", totals: "highlight", footer: "minimal", density: "standard", palette: { primary: "#9A3412", secondary: "#EA580C", accent: "#FFF7ED" }, font: "montserrat" },
  { id: "violet-premium", name: "Violet Premium", category: "Premium", header: "logo-center", title: "underlined", table: "rounded", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#4C1D95", secondary: "#7C3AED", accent: "#F5F3FF" }, font: "playfair" },
  { id: "beige-minimal", name: "Beige Minimal", category: "Minimal", header: "minimal", title: "minimal", table: "borderless", totals: "minimal-lines", footer: "minimal", density: "airy", palette: { primary: "#78716C", secondary: "#A8A29E", accent: "#FAFAF9" }, font: "dmsans" },
  { id: "gris-anthracite", name: "Gris Anthracite", category: "Corporate", header: "logo-left", title: "large", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#1F2937", secondary: "#4B5563", accent: "#F3F4F6" }, font: "inter" },
  { id: "monochrome", name: "Monochrome", category: "Minimal", header: "logo-left", title: "minimal", table: "minimal", totals: "minimal-lines", footer: "minimal", density: "standard", palette: { primary: "#000000", secondary: "#525252", accent: "#F5F5F5" }, font: "work" },
  { id: "noir-blanc", name: "Noir & Blanc", category: "Minimal", header: "logo-center", title: "underlined", table: "classic", totals: "right", footer: "minimal", density: "standard", palette: { primary: "#000000", secondary: "#111111", accent: "#FFFFFF" }, font: "georgia" },
  { id: "clean-business", name: "Clean Business", category: "Moderne", header: "logo-left", title: "large", table: "minimal", totals: "highlight", footer: "business", density: "standard", palette: { primary: "#0F766E", secondary: "#14B8A6", accent: "#F0FDFA" }, font: "nunito" },
  { id: "startup", name: "Startup", category: "Moderne", header: "band", title: "badge", table: "rounded", totals: "highlight", footer: "minimal", density: "airy", palette: { primary: "#6366F1", secondary: "#818CF8", accent: "#EEF2FF" }, font: "poppins" },
  { id: "tech", name: "Tech", category: "Moderne", header: "logo-left", title: "large", table: "borderless", totals: "colored-box", footer: "minimal", density: "compact", palette: { primary: "#0EA5E9", secondary: "#22D3EE", accent: "#ECFEFF" }, font: "work" },
  { id: "finance", name: "Finance", category: "Corporate", header: "corporate", title: "large", table: "classic", totals: "colored-box", footer: "legal", density: "standard", palette: { primary: "#1E3A8A", secondary: "#3730A3", accent: "#E0E7FF" }, font: "source" },
  { id: "executive", name: "Executive", category: "Premium", header: "band", title: "badge", table: "borderless", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#1C1917", secondary: "#78716C", accent: "#FAFAF9" }, font: "merriweather" },
  { id: "cabinet", name: "Cabinet", category: "Classique", header: "logo-center", title: "small", table: "classic", totals: "right", footer: "legal", density: "standard", palette: { primary: "#4C1D95", secondary: "#6B21A8", accent: "#FAF5FF" }, font: "libre" },
  { id: "artisan", name: "Artisan", category: "Artisan", header: "logo-left", title: "large", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#78350F", secondary: "#CA8A04", accent: "#FEF9C3" }, font: "raleway" },
  { id: "batiment", name: "Bâtiment", category: "Bâtiment", header: "band", title: "large", table: "colored", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#1F2937", secondary: "#F59E0B", accent: "#FEF3C7" }, font: "roboto" },
  { id: "construction-moderne", name: "Construction Moderne", category: "Bâtiment", header: "band", title: "badge", table: "alt", totals: "highlight", footer: "business", density: "standard", palette: { primary: "#0F172A", secondary: "#F97316", accent: "#FFF7ED" }, font: "montserrat" },
  { id: "architecte", name: "Architecte", category: "Bâtiment", header: "minimal", title: "minimal", table: "borderless", totals: "minimal-lines", footer: "minimal", density: "airy", palette: { primary: "#111827", secondary: "#525252", accent: "#F5F5F4" }, font: "dmsans" },
  { id: "renovation", name: "Rénovation", category: "Bâtiment", header: "logo-left", title: "large", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#7C2D12", secondary: "#EA580C", accent: "#FFF7ED" }, font: "raleway" },
  { id: "plomberie", name: "Plomberie", category: "Bâtiment", header: "band", title: "large", table: "colored", totals: "highlight", footer: "business", density: "standard", palette: { primary: "#0369A1", secondary: "#0EA5E9", accent: "#F0F9FF" }, font: "inter" },
  { id: "electricite", name: "Électricité", category: "Bâtiment", header: "band", title: "badge", table: "colored", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#854D0E", secondary: "#EAB308", accent: "#FEFCE8" }, font: "roboto" },
  { id: "peinture", name: "Peinture", category: "Bâtiment", header: "band", title: "large", table: "alt", totals: "highlight", footer: "business", density: "standard", palette: { primary: "#5B21B6", secondary: "#A78BFA", accent: "#F5F3FF" }, font: "poppins" },
  { id: "garage-auto", name: "Garage Automobile", category: "Automobile", header: "band", title: "badge", table: "colored", totals: "colored-box", footer: "business", density: "compact", palette: { primary: "#111827", secondary: "#DC2626", accent: "#F3F4F6" }, font: "roboto" },
  { id: "auto-premium", name: "Auto Premium", category: "Automobile", header: "band", title: "underlined", table: "borderless", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#0C0A09", secondary: "#B89545", accent: "#FAFAF9" }, font: "playfair" },
  { id: "car-dealer", name: "Car Dealer", category: "Automobile", header: "logo-right", title: "large", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#1E3A8A", secondary: "#0EA5E9", accent: "#EFF6FF" }, font: "montserrat" },
  { id: "transport", name: "Transport", category: "Automobile", header: "logo-left", title: "large", table: "alt", totals: "colored-box", footer: "business", density: "compact", palette: { primary: "#0F172A", secondary: "#22C55E", accent: "#F0FDF4" }, font: "work" },
  { id: "restaurant", name: "Restaurant", category: "Créatif", header: "logo-center", title: "underlined", table: "borderless", totals: "premium", footer: "minimal", density: "airy", palette: { primary: "#7F1D1D", secondary: "#DC2626", accent: "#FEF2F2" }, font: "playfair" },
  { id: "commerce", name: "Commerce", category: "Moderne", header: "logo-left", title: "large", table: "classic", totals: "right", footer: "business", density: "standard", palette: { primary: "#065F46", secondary: "#10B981", accent: "#ECFDF5" }, font: "opensans" },
  { id: "consultant", name: "Consultant", category: "Corporate", header: "minimal", title: "small", table: "minimal", totals: "minimal-lines", footer: "legal", density: "airy", palette: { primary: "#0F172A", secondary: "#475569", accent: "#F1F5F9" }, font: "source" },
  { id: "freelance", name: "Freelance", category: "Moderne", header: "band", title: "badge", table: "rounded", totals: "highlight", footer: "minimal", density: "standard", palette: { primary: "#8B5CF6", secondary: "#A78BFA", accent: "#F5F3FF" }, font: "dmsans" },
  { id: "creative", name: "Creative", category: "Créatif", header: "band", title: "badge", table: "rounded", totals: "highlight", footer: "minimal", density: "airy", palette: { primary: "#DB2777", secondary: "#F472B6", accent: "#FDF2F8" }, font: "poppins" },
  { id: "luxury", name: "Luxury", category: "Premium", header: "logo-center", title: "underlined", table: "borderless", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#0C0A09", secondary: "#A8842B", accent: "#FAFAF9" }, font: "playfair" },
  { id: "simple-compact", name: "Simple Compact", category: "Compact", header: "minimal", title: "small", table: "compact", totals: "right", footer: "minimal", density: "compact", palette: { primary: "#111827", secondary: "#374151", accent: "#F3F4F6" }, font: "arial" },
  { id: "grande-typo", name: "Grande Typographie", category: "Moderne", header: "logo-left", title: "large", table: "borderless", totals: "premium", footer: "minimal", density: "airy", palette: { primary: "#171717", secondary: "#525252", accent: "#F5F5F5" }, font: "montserrat" },
  { id: "sidebar", name: "Sidebar", category: "Moderne", header: "sidebar", title: "badge", table: "minimal", totals: "colored-box", footer: "minimal", density: "standard", palette: { primary: "#1E3A8A", secondary: "#3B82F6", accent: "#DBEAFE" }, font: "inter" },
  { id: "header-colore", name: "Header Coloré", category: "Moderne", header: "band", title: "badge", table: "alt", totals: "highlight", footer: "minimal", density: "standard", palette: { primary: "#7C3AED", secondary: "#A78BFA", accent: "#F5F3FF" }, font: "poppins" },
  { id: "border-design", name: "Border Design", category: "Classique", header: "logo-left", title: "underlined", table: "classic", totals: "colored-box", footer: "business", density: "standard", palette: { primary: "#0F172A", secondary: "#1E3A8A", accent: "#EFF6FF" }, font: "merriweather" },
  { id: "signature-premium", name: "Signature Premium", category: "Premium", header: "logo-center", title: "underlined", table: "borderless", totals: "premium", footer: "legal", density: "airy", palette: { primary: "#111827", secondary: "#B89545", accent: "#FAFAF9" }, font: "libre" },
];

export const templateCategories = ["Tous", "Classique", "Moderne", "Minimal", "Premium", "Corporate", "Artisan", "Automobile", "Bâtiment", "Créatif", "Compact"];

export const defaultTemplateConfig = (t) => ({
  templateId: t.id,
  header: t.header,
  title: t.title,
  table: t.table,
  totals: t.totals,
  footer: t.footer,
  density: t.density,
  font: t.font,
  primary: t.palette.primary,
  secondary: t.palette.secondary,
  accent: t.palette.accent,
});

export function fontFamilyOf(fontId) {
  return (fontOptions.find((f) => f.id === fontId) || fontOptions[0]).family;
}
