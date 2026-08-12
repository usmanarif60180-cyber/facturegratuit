import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");

const requiredProductionMarkers = [
  'content="Ufq2oRt5WVm6xRbTxoe-616vgUL5cyYXySATGhvQsso"',
  "ca-pub-4956341710070686",
  'projectId: "facturergratuit"',
  'measurementId: "G-JJCNL9THWD"',
  "d1bc43d9c361497fe84f0149e51b36ae"
];
requiredProductionMarkers.forEach(marker => assert(index.includes(marker), `Missing production marker: ${marker}`));

[
  "profacture_invoice_builder_draft",
  "profacture_quote_builder_draft",
  "data-invoice-duplicate",
  "data-quote-duplicate",
  "data-quote-convert",
  "refreshAutomaticInvoiceStatuses",
  "data-sync-chip",
  'profactureTrack("invoice_saved"',
  'profactureTrack("pdf_download"'
].forEach(marker => assert(index.includes(marker), `Missing regression marker: ${marker}`));

assert(index.includes("@media print"), "Print stylesheet is missing");
assert(index.includes('class="print-doc"'), "Printable invoice markup is missing");
assert(index.includes("width: 794px"), "A4 preview width contract changed");
assert(index.includes("min-height: 1123px"), "A4 preview height contract changed");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const localUrls = [...sitemap.matchAll(/<loc>https:\/\/facturergratuit\.com\/([^<]*)<\/loc>/g)]
  .map(match => decodeURIComponent(match[1] || ""))
  .filter(Boolean);
localUrls.forEach(url => assert(fs.existsSync(path.join(root, url)), `Sitemap target missing: ${url}`));

const htmlFiles = fs.readdirSync(root).filter(name => name.endsWith(".html"));
htmlFiles.forEach(name => {
  const html = fs.readFileSync(path.join(root, name), "utf8");
  assert(/<title>[^<]{10,}<\/title>/i.test(html), `${name}: missing useful title`);
  assert(/<meta\s+name="description"\s+content="[^"]{50,}"/i.test(html), `${name}: missing useful meta description`);
});

console.log(`Regression checks passed: ${htmlFiles.length} HTML pages and ${localUrls.length} sitemap URLs.`);
