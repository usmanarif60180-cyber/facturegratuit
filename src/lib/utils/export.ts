/**
 * Dependency-free export helpers. No PDF/Excel library is added to the
 * bundle — PDF export reuses the app's existing window.print() + print-CSS
 * pattern (see PrintButton.tsx), and "Export Excel" uses the well-known
 * HTML-table-as-.xls technique: Excel natively opens an HTML table wrapped
 * in the right XML namespace when saved with an .xls extension, no zip/XML
 * writer required. CSV export is a real, standard CSV.
 */

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv<T>(filename: string, columns: ExportColumn<T>[], rows: T[]) {
  const header = columns.map((c) => escapeCsvCell(c.header)).join(",");
  const lines = rows.map((row) => columns.map((c) => escapeCsvCell(c.value(row))).join(","));
  downloadBlob(`${filename}.csv`, [header, ...lines].join("\n"), "text/csv;charset=utf-8;");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function exportToExcel<T>(filename: string, columns: ExportColumn<T>[], rows: T[]) {
  const headerRow = `<tr>${columns.map((c) => `<th>${escapeHtml(c.header)}</th>`).join("")}</tr>`;
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${escapeHtml(String(c.value(row)))}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${escapeHtml(
    filename
  )}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
<body><table border="1">${headerRow}${bodyRows}</table></body></html>`;

  downloadBlob(`${filename}.xls`, html, "application/vnd.ms-excel;charset=utf-8;");
}

/** Opens the browser print dialog scoped to whatever the page marks
 * print-visible via CSS — same mechanism used for invoice/quote PDFs. */
export function exportToPdf() {
  window.print();
}
