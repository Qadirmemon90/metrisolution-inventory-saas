/**
 * MetriSolution Inventory ERP SaaS - Safe CSV Export Service
 * Protects against CSV / Spreadsheet formula injection (CWE-1236)
 */

function sanitizeForCsv(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // If the string starts with dangerous formula trigger characters: = + - @ \t \r
  // Prefix with an apostrophe to ensure Excel / Sheets interprets it as plain text
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape inner double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

export function exportToCsv(filename, headers, rows) {
  const headerRow = headers.map(h => sanitizeForCsv(h.label)).join(',');
  const dataRows = rows.map(row => {
    return headers.map(h => {
      const val = typeof h.accessor === 'function' ? h.accessor(row) : row[h.accessor];
      return sanitizeForCsv(val);
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n'); // Add UTF-8 BOM for Excel
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
