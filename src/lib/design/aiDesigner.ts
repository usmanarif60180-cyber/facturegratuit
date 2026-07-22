import type { DesignConfig, DocumentStyleId, FontId } from "@/types/design";
import { getPalette } from "./palettes";
import { FONT_OPTIONS } from "./fonts";

/**
 * Deterministic keyword → design-config matcher. There is no LLM wired
 * into this app (the AI Assistant page is itself a "coming soon"
 * placeholder) — this gives instant, dependency-free results today and is
 * a drop-in replacement point for a real model call later: swap the body
 * of `parseDesignPrompt` for an API call and keep the same return shape.
 */
export interface AiDesignMatch {
  documentStyle?: DocumentStyleId;
  paletteId?: string;
  headingFont?: FontId;
  bodyFont?: FontId;
  matchedTerms: string[];
}

const STYLE_KEYWORDS: Record<string, DocumentStyleId> = {
  classic: "classic",
  modern: "modern",
  corporate: "corporate",
  elegant: "elegant",
  luxury: "luxury",
  executive: "executive",
  minimal: "minimal",
  minimalist: "minimal",
  creative: "creative",
  construction: "construction",
  technology: "technology",
  tech: "technology",
  professional: "professional",
};

const COLOR_KEYWORDS: Record<string, string> = {
  "ocean blue": "ocean-blue",
  "royal blue": "royal-blue",
  blue: "royal-blue",
  black: "midnight-black",
  midnight: "midnight-black",
  emerald: "emerald",
  green: "forest-green",
  purple: "modern-purple",
  violet: "modern-purple",
  orange: "sunset-orange",
  sunset: "sunset-orange",
  gray: "business-gray",
  grey: "business-gray",
  gold: "luxury-gold",
  golden: "luxury-gold",
  navy: "navy",
  white: "white-minimal",
  dark: "professional-dark",
};

const FONT_KEYWORDS: Record<string, FontId> = Object.fromEntries(
  FONT_OPTIONS.map((f) => [f.label.toLowerCase(), f.id])
);

export function parseDesignPrompt(prompt: string): AiDesignMatch {
  const lower = prompt.toLowerCase();
  const matched: string[] = [];
  const result: AiDesignMatch = { matchedTerms: matched };

  for (const [keyword, style] of Object.entries(STYLE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      result.documentStyle = style;
      matched.push(keyword);
      break;
    }
  }

  for (const [keyword, paletteId] of Object.entries(COLOR_KEYWORDS)) {
    if (lower.includes(keyword)) {
      result.paletteId = paletteId;
      matched.push(keyword);
      break;
    }
  }

  for (const [keyword, fontId] of Object.entries(FONT_KEYWORDS)) {
    if (lower.includes(keyword)) {
      result.headingFont = fontId;
      result.bodyFont = fontId;
      matched.push(keyword);
      break;
    }
  }

  return result;
}

export function applyAiMatch(current: DesignConfig, match: AiDesignMatch): DesignConfig {
  return {
    ...current,
    documentStyle: match.documentStyle ?? current.documentStyle,
    palette: match.paletteId ? getPalette(match.paletteId) : current.palette,
    typography: {
      ...current.typography,
      headingFont: match.headingFont ?? current.typography.headingFont,
      bodyFont: match.bodyFont ?? current.typography.bodyFont,
    },
  };
}
