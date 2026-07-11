import {
  Inter,
  Roboto,
  Poppins,
  Montserrat,
  Open_Sans,
  Nunito,
  Lato,
  Source_Sans_3,
  IBM_Plex_Sans,
  Work_Sans,
  DM_Sans,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import type { FontId } from "@/types/design";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const sourceSansPro = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans", display: "swap" });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-ibm-plex", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

/** All font className vars, applied once on <body> in the root layout so
 * every CSS variable is available anywhere in the tree — the Design Studio
 * then only needs to reference `var(--font-*)`, never load fonts itself. */
export const FONT_VARIABLE_CLASS = [
  inter.variable,
  roboto.variable,
  poppins.variable,
  montserrat.variable,
  openSans.variable,
  nunito.variable,
  lato.variable,
  sourceSansPro.variable,
  ibmPlexSans.variable,
  workSans.variable,
  dmSans.variable,
  GeistSans.variable,
].join(" ");

export interface FontOption {
  id: FontId;
  label: string;
  cssVar: string;
  category: "sans" | "geometric" | "humanist";
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "inter", label: "Inter", cssVar: "var(--font-inter)", category: "sans" },
  { id: "geist", label: "Geist", cssVar: "var(--font-geist-sans)", category: "sans" },
  { id: "roboto", label: "Roboto", cssVar: "var(--font-roboto)", category: "sans" },
  { id: "poppins", label: "Poppins", cssVar: "var(--font-poppins)", category: "geometric" },
  { id: "montserrat", label: "Montserrat", cssVar: "var(--font-montserrat)", category: "geometric" },
  { id: "openSans", label: "Open Sans", cssVar: "var(--font-open-sans)", category: "humanist" },
  { id: "nunito", label: "Nunito", cssVar: "var(--font-nunito)", category: "humanist" },
  { id: "lato", label: "Lato", cssVar: "var(--font-lato)", category: "humanist" },
  { id: "sourceSansPro", label: "Source Sans Pro", cssVar: "var(--font-source-sans)", category: "humanist" },
  { id: "ibmPlexSans", label: "IBM Plex Sans", cssVar: "var(--font-ibm-plex)", category: "sans" },
  { id: "workSans", label: "Work Sans", cssVar: "var(--font-work-sans)", category: "geometric" },
  { id: "dmSans", label: "DM Sans", cssVar: "var(--font-dm-sans)", category: "geometric" },
];

export function fontCssVar(id: FontId): string {
  return FONT_OPTIONS.find((f) => f.id === id)?.cssVar ?? "var(--font-inter)";
}
