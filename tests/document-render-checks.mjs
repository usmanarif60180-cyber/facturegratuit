import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const area = { innerHTML: '' };
let prints = 0;
const context = vm.createContext({
  window: {
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
vm.runInContext(section('    function documentCopy(', '    function fitDocPreview('), context);
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
