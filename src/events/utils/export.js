// Data Export Utilities (P3.8)

export function exportToCSV(data, columns, filename = "export.csv") {
  const headers = columns.map(c => c.label).join(",");
  const rows = data.map(row =>
    columns.map(c => {
      const value = row[c.key] ?? "";
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(",") || escaped.includes("\n") ? `"${escaped}"` : escaped;
    }).join(",")
  );

  const csv = [headers, ...rows].join("\n");
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

export function exportToExcel(data, columns, filename = "export.xlsx") {
  const header = columns.map(c => `<th>${escapeXml(c.label)}</th>`).join("");
  const rows = data.map(row =>
    `<tr>${columns.map(c => `<td>${escapeXml(String(row[c.key] ?? ""))}</td>`).join("")}</tr>`
  ).join("");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Sheet1">
<Table>
<Row>${header}</Row>
${rows}
</Table>
</Worksheet>
</Workbook>`;

  downloadFile(xml, filename, "application/vnd.ms-excel");
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function downloadFile(content, filename, mimeType) {
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
