import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const financialEngine = await import('../financial-engine.js');
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const area = { innerHTML: '' };
let prints = 0;
const context = vm.createContext({
  window: {
    ProFactureFinancial: financialEngine.default,
    renderClientFinancials() { throw new Error('Document rendering must not call client analytics'); },
    print() { prints++; }
  },
  document: { getElementById: () => area },
  TAX_RATES: { none: 0, vat20: 20, vat10: 10 },
  currentDefaultCountry: 'FR', currentLang: 'fr', currentCurrency: 'EUR',
  dsState: {}, getI18nLang: () => 'fr', ccGet: () => '',
  getCompanyLogo: () => '', getCompanyStamp: () => '', getCompanySignature: () => '',
  currentCompanyProfile: () => ({ name: 'Test Company', siret: '12345678900001', address: 'Test address' }),
  t: key => key, fmtDate: date => date || '',
  formatCurrency: (n, code) => `${code} ${n.toFixed(2)}`,
  escapeHtml: value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
  htmlLines: value => String(value ?? '')
});
vm.runInContext(section('    function calculateDocumentTotals(', '    function readCurrencyAmount('), context);
vm.runInContext(section('    var DS_THEMES = [', '    var DS_FONTS = ['), context);
vm.runInContext(section('    function documentCopy(', '    function fitDocPreview('), context);
assert.equal(context.DS_THEMES.length, 100);
assert.equal(new Set(context.DS_THEMES.map(theme => theme.id)).size, 100);
assert.equal(new Set(context.DS_THEMES.map(theme => [theme.primary, theme.secondary, theme.accent].join('/'))).size, 100);
assert.ok(context.DS_THEMES.every(theme => /^#[0-9A-F]{6}$/.test(theme.primary) && /^#[0-9A-F]{6}$/.test(theme.secondary)));
assert.ok(context.DS_THEMES.slice(12).every(theme => context.dsWhiteContrast(theme.primary) >= 4.5));
assert.equal((source.match(/window\.renderClientFinancials\(c\)/g) || []).length, 1);
for (const type of ['invoice', 'quote']) {
  for (const items of [[], [{ desc: 'Service', qty: 2, price: 100, tax: 'vat20' }]]) {
    const doc = { id: 'TEST-1', client: 'Test Client', currency: 'EUR', country: 'FR', issue: '2026-09-09', items, total: items.length ? 240 : 0 };
    const html = context.buildDocPrintHtml({ ...doc, currencyCode: doc.currency, documentType: type, title: type, number: doc.id });
    assert.ok(html.includes('print-doc-table'));
    assert.ok(html.includes('Test Company'));
    assert.ok(html.includes('Test Client'));
    if (items.length) {
      assert.ok(html.includes('EUR 200.00'));
      assert.ok(html.includes('EUR 40.00'));
      assert.ok(html.includes('EUR 240.00'));
    }
    context[type === 'invoice' ? 'downloadInvoicePdf' : 'downloadQuotePdf'](doc);
    assert.ok(area.innerHTML.includes('print-doc-table'));
  }
}
assert.equal(prints, 4);
const stampedInvoice = context.buildDocPrintHtml({
  documentType: 'invoice', title: 'Facture', number: 'STAMP-1', client: 'Test Client',
  items: [{ desc: 'Service', qty: 1, price: 100, tax: 'vat20' }],
  stamp: 'data:image/png;base64,AAAA', signature: 'data:image/png;base64,BBBB'
});
assert.ok(stampedInvoice.includes('print-doc-sig'));
assert.equal((stampedInvoice.match(/data:image\/png;base64,/g) || []).length, 2);
assert.ok(stampedInvoice.indexOf('print-doc-sig') > stampedInvoice.indexOf('print-doc-table'));
for (const [paymentDisplay, expected] of [['paid', 'PAYÉE'], ['unpaid', 'NON PAYÉE'], ['overdue', 'EN RETARD']]) {
  const html = context.buildDocPrintHtml({ documentType: 'invoice', country: 'FR', paymentDisplay });
  assert.ok(html.includes(`>${expected}</div>`));
  assert.ok(!context.buildDocPrintHtml({ documentType: 'quote', country: 'FR', paymentDisplay }).includes('print-doc-payment-badge'));
}
assert.ok(!context.buildDocPrintHtml({ documentType: 'invoice', paymentDisplay: '<script>' }).includes('print-doc-payment-badge'));
assert.ok(source.includes('paymentDisplay: document.getElementById("inv-new-payment-label").value'));
assert.ok(source.includes('paymentDisplay: inv.paymentDisplay || ""'));
const description = 'Preparation du chantier\n' + 'Details des travaux '.repeat(100) + '\n</textarea><script>test</script>';
const multiline = context.buildDocPrintHtml({ documentType: 'quote', items: [{ desc: description, qty: 1, price: 10, tax: 'none' }] });
assert.ok(multiline.includes('Preparation du chantier\n'));
assert.ok(multiline.includes('&lt;/textarea&gt;'));
assert.ok(!multiline.includes('<script>test'));
assert.equal((source.match(/textarea class="field line-description"/g) || []).length, 2);
vm.runInContext(section('    function resizeLineDescription(', '    var descriptionWidths'), context);
const field = { clientWidth: 180, scrollHeight: 240, offsetHeight: 52, clientHeight: 50, style: {} };
context.resizeLineDescription(field);
assert.equal(field.style.height, '242px');
field.scrollHeight = 48;
context.resizeLineDescription(field);
assert.equal(field.style.height, '50px');
field.clientWidth = 0;
context.resizeLineDescription(field);
assert.equal(field.style.height, '50px');
console.log('Document render checks passed: invoice/quote previews, empty drafts, TVA and print/PDF dispatch.');
