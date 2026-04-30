export type CSVCell = string | number | null | undefined;

export interface CSVSection {
  title?: string;
  headers: string[];
  rows: CSVCell[][];
}

function escapeCSVCell(cell: CSVCell): string {
  if (cell === null || cell === undefined) return "";
  const str = String(cell);
  return str.includes(",") || str.includes('"') || str.includes("\n")
    ? `"${str.replace(/"/g, '""')}"`
    : str;
}

function downloadCSV(filename: string, csvContent: string) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportSectionsToCSV(filename: string, sections: CSVSection[]) {
  const lines = sections.flatMap((section, index) => {
    const sectionLines = [
      ...(section.title ? [[section.title]] : []),
      section.headers,
      ...section.rows,
    ].map((row) => row.map(escapeCSVCell).join(","));

    return index < sections.length - 1 ? [...sectionLines, ""] : sectionLines;
  });

  downloadCSV(filename, lines.join("\n"));
}

export function exportToCSV(filename: string, headers: string[], rows: CSVCell[][]) {
  exportSectionsToCSV(filename, [{ headers, rows }]);
}
