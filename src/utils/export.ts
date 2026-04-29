export function exportToCSV(filename: string, headers: string[], rows: (string | number | null)[][]) {
  const bom = "﻿";
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => {
        if (cell === null || cell === undefined) return "";
        const str = String(cell);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
