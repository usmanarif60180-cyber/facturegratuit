import type { DocumentStyleId, DocumentStyleKnobs } from "@/types/design";

export const DOCUMENT_STYLE_KNOBS: Record<DocumentStyleId, DocumentStyleKnobs> = {
  classic: { headerAlign: "split", accentBar: "none", titleTransform: "capitalize", cornerRadius: "none", divider: "line" },
  modern: { headerAlign: "split", accentBar: "top", titleTransform: "uppercase", cornerRadius: "lg", divider: "none" },
  corporate: { headerAlign: "split", accentBar: "left", titleTransform: "uppercase", cornerRadius: "none", divider: "double" },
  elegant: { headerAlign: "centered", accentBar: "none", titleTransform: "capitalize", cornerRadius: "sm", divider: "dotted" },
  luxury: { headerAlign: "centered", accentBar: "top", titleTransform: "uppercase", cornerRadius: "none", divider: "double" },
  executive: { headerAlign: "split", accentBar: "left", titleTransform: "capitalize", cornerRadius: "sm", divider: "line" },
  minimal: { headerAlign: "split", accentBar: "none", titleTransform: "none", cornerRadius: "none", divider: "none" },
  creative: { headerAlign: "stacked", accentBar: "top", titleTransform: "uppercase", cornerRadius: "lg", divider: "none" },
  construction: { headerAlign: "split", accentBar: "top", titleTransform: "uppercase", cornerRadius: "none", divider: "line" },
  technology: { headerAlign: "split", accentBar: "left", titleTransform: "uppercase", cornerRadius: "lg", divider: "none" },
  professional: { headerAlign: "split", accentBar: "none", titleTransform: "capitalize", cornerRadius: "sm", divider: "line" },
};

export const DOCUMENT_STYLE_LABELS: Record<DocumentStyleId, string> = {
  classic: "Classic",
  modern: "Modern",
  corporate: "Corporate",
  elegant: "Elegant",
  luxury: "Luxury",
  executive: "Executive",
  minimal: "Minimal",
  creative: "Creative",
  construction: "Construction",
  technology: "Technology",
  professional: "Professional",
};
