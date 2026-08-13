import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const functionsSource = fs.readFileSync(path.join(root, "functions", "index.js"), "utf8");

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

[
  'id="inv-new-company"',
  'id="q-new-company"',
  'data-company-apply=',
  'data-company-edit=',
  'data-client-edit=',
  'companyProfile: Object.assign({}, currentCompanyProfile())',
  'window.profactureEnsureActiveCompany = ensureActiveCompany',
  'id="acp-siret"',
  'id="acp-address"',
  'id="ac-siret"',
  'id="ac-site-address"',
  'sourceCompanyId: company.id'
].forEach(marker => assert(index.includes(marker), `Missing company/client workflow marker: ${marker}`));
[
  'data-company-delete=',
  'id="acp-logo-file"',
  'id="acp-stamp-file"',
  'id="acp-signature-file"',
  'function activeCompanyItems(items)',
  'existing.companyId = wsActiveId',
  'logo: getCompanyLogo(), stamp: getCompanyStamp(), signature: getCompanySignature()',
  'profacture_invoice_builder_draft_" + wsActiveId',
  'profacture_quote_builder_draft_" + wsActiveId'
].forEach(marker => assert(index.includes(marker), `Missing multi-company isolation marker: ${marker}`));
assert(index.includes('number: editingInvoiceId || nextDocumentId("INV-", INVOICES)'), "Invoice preview must show its next number instead of Draft");
assert(index.includes('number: editingQuoteId || nextDocumentId("QUO-", QUOTES)'), "Quote preview must show its next number instead of Draft");

[
  'id="ai-fab-btn"',
  'id="ai-popup"',
  'httpsCallable(functions, "aiAssistant", { limitedUseAppCheckTokens: true })',
  'function applyAiAction(action)'
].forEach(marker => assert(index.includes(marker), `Missing AI assistant marker: ${marker}`));
assert(!/>[^<]*Gemini[^<]*</i.test(index), "The public UI must not expose the AI provider name");
assert(functionsSource.includes("defineSecret('PROFACTURE_AI_API_KEY')"), "AI provider key must use Firebase Secret Manager");
assert(functionsSource.includes('exports.aiAssistant = onCall'), "AI callable backend must exist");
assert(functionsSource.includes('exports.aiHistory = onCall'), "Company-scoped AI cloud history must exist");
assert(functionsSource.includes('perDay: 25') && functionsSource.includes('globalPerMonth: 2000'), "AI cost ceilings must remain conservative");
assert(functionsSource.includes('globalTokensPerMonth: 2500000'), "AI monthly token ceiling is missing");
assert(functionsSource.includes('consumeAppCheckToken: true'), "AI callable replay protection must remain enabled");
assert(functionsSource.includes('normalizeAiAction(parsed.action, context)'), "AI actions must be validated server-side");
assert(index.includes('id="ai-history-clear"') && index.includes('id="ai-usage"'), "AI history and usage controls are missing");
assert(index.includes('Review & apply · '), "AI document actions must show a review step");
assert(index.includes('aria-modal="true"') && index.includes('role="log"'), "AI dialog accessibility contract changed");
assert(functionsSource.includes('Never save, send, email, delete, or charge anything'), "AI backend must forbid destructive autonomous actions");

assert(index.includes('var MOBILE_ADS_DISABLED = window.matchMedia("(max-width: 900px)").matches;'), "Mobile ad runtime must remain disabled");
assert(index.includes('frame.setAttribute("sandbox", "allow-scripts")'), "Third-party banners must run in an opaque sandbox");
assert(!index.includes('frame.setAttribute("sandbox", "allow-scripts allow-same-origin")'), "Ad iframe sandbox must not allow same-origin access");
assert(!index.includes("commendtwisted.com") && !index.includes("soleniva.net"), "Redirect/popunder domains must not be present");

assert(index.includes("@media print"), "Print stylesheet is missing");
assert(index.includes('class="print-doc"'), "Printable invoice markup is missing");
assert(index.includes("width: 794px"), "A4 preview width contract changed");
assert(index.includes("min-height: 1123px"), "A4 preview height contract changed");
assert(index.includes("@page { size: A4 portrait; margin: 0; }"), "Exact A4 print page contract changed");
assert(index.includes("#print-area .print-doc { width: 210mm; min-height: 297mm;"), "Printable document no longer fills an A4 page");
assert(index.includes(".print-doc-sig {") && index.includes("margin-top: auto;"), "Stamp/signature is no longer anchored to the A4 footer");
assert(index.includes('class="print-doc-party"'), "Modern document information panels are missing");
assert(index.includes(".print-doc-total { align-self: flex-end;"), "Modern A4 total summary is missing");
assert(index.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"), "Company and client document blocks must use two columns");
assert(index.includes('class="print-doc-site"'), "Jobsite address is no longer nested in the client block");
assert(!index.includes('opts.status ? "<div>" + escapeHtml(docStatusLabel(opts.status))'), "Draft status must not replace the document date in the header");

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
  assert(!html.includes('sandbox="allow-scripts allow-same-origin"'), `${name}: advertising iframe has unsafe sandbox permissions`);
});

console.log(`Regression checks passed: ${htmlFiles.length} HTML pages and ${localUrls.length} sitemap URLs.`);
