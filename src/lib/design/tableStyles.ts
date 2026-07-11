import type { TableConfig, TableStyleId } from "@/types/design";

export const TABLE_STYLE_LABELS: Record<TableStyleId, string> = {
  rounded: "Rounded",
  minimal: "Minimal",
  corporate: "Corporate",
  bordered: "Bordered",
  clean: "Clean",
  luxury: "Luxury",
  striped: "Striped",
  compact: "Compact",
  comfortable: "Comfortable",
};

/** Sensible default knob values per named table style — the user can still
 * override individual knobs after picking a style. */
export const TABLE_STYLE_PRESETS: Record<TableStyleId, Omit<TableConfig, "style">> = {
  rounded: { borderThickness: 1, rowHeight: "comfortable", headerStyle: "filled", alternatingRows: false },
  minimal: { borderThickness: 0, rowHeight: "comfortable", headerStyle: "underline", alternatingRows: false },
  corporate: { borderThickness: 1, rowHeight: "comfortable", headerStyle: "filled", alternatingRows: false },
  bordered: { borderThickness: 2, rowHeight: "comfortable", headerStyle: "outline", alternatingRows: false },
  clean: { borderThickness: 0, rowHeight: "comfortable", headerStyle: "underline", alternatingRows: false },
  luxury: { borderThickness: 1, rowHeight: "spacious", headerStyle: "underline", alternatingRows: false },
  striped: { borderThickness: 0, rowHeight: "comfortable", headerStyle: "filled", alternatingRows: true },
  compact: { borderThickness: 0, rowHeight: "compact", headerStyle: "underline", alternatingRows: false },
  comfortable: { borderThickness: 0, rowHeight: "spacious", headerStyle: "filled", alternatingRows: false },
};
