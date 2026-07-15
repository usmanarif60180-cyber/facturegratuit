"use client";

import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { exportToCsv, exportToExcel, exportToPdf, type ExportColumn } from "@/lib/utils/export";

interface ExportMenuProps<T> {
  filename: string;
  columns: ExportColumn<T>[];
  rows: T[];
  /** Shows the "Print / PDF" option — omit on pages with no printable view. */
  showPdf?: boolean;
}

export function ExportMenu<T>({ filename, columns, rows, showPdf = true }: ExportMenuProps<T>) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => exportToCsv(filename, columns, rows)}>
          <FileText className="h-4 w-4" /> Export CSV
        </DropdownItem>
        <DropdownItem onSelect={() => exportToExcel(filename, columns, rows)}>
          <FileSpreadsheet className="h-4 w-4" /> Export Excel
        </DropdownItem>
        {showPdf && (
          <DropdownItem onSelect={exportToPdf}>
            <Printer className="h-4 w-4" /> Print / PDF
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
