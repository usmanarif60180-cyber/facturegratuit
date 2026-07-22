import type { DesignConfig, DocumentStyleId, TableStyleId } from "@/types/design";
import { defaultSections } from "@/types/design";
import { getPalette } from "./palettes";
import { TABLE_STYLE_PRESETS } from "./tableStyles";

export function buildDesignConfig(overrides: {
  id: string;
  name: string;
  documentStyle: DocumentStyleId;
  paletteId: string;
  tableStyle?: TableStyleId;
  headingFont?: DesignConfig["typography"]["headingFont"];
  bodyFont?: DesignConfig["typography"]["bodyFont"];
}): DesignConfig {
  const tableStyle = overrides.tableStyle ?? "clean";
  const headingFont = overrides.headingFont ?? "inter";
  const bodyFont = overrides.bodyFont ?? "inter";
  return {
    id: overrides.id,
    name: overrides.name,
    documentStyle: overrides.documentStyle,
    palette: getPalette(overrides.paletteId),
    typography: {
      headingFont,
      bodyFont,
      tableFont: bodyFont,
      footerFont: bodyFont,
      baseFontSize: 13,
      headingWeight: 700,
      bodyWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    table: { style: tableStyle, ...TABLE_STYLE_PRESETS[tableStyle] },
    page: { size: "a4", orientation: "portrait", margin: "normal", pageNumbers: true, repeatHeader: true },
    sections: defaultSections(),
    logoPosition: "left",
    spacing: "normal",
    footerVisible: true,
    footerText: "Thank you for your business.",
  };
}

export const DEFAULT_DESIGN_CONFIG: DesignConfig = buildDesignConfig({
  id: "default",
  name: "Default",
  documentStyle: "professional",
  paletteId: "royal-blue",
  tableStyle: "clean",
  headingFont: "inter",
  bodyFont: "inter",
});
