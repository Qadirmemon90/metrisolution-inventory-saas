/**
 * MetriSolution Inventory ERP SaaS - Safe Client-Side CSV Parser & Validator
 * Used in Setup Onboarding Wizard Step 4 and Bulk Product Import
 */

export function parseCsvText(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      headers: [],
      rows: [],
      errors: ['The uploaded CSV file is empty or missing a header row.'],
      validCount: 0
    };
  }

  // Parse header
  const headers = splitCsvLine(lines[0]).map(h => h.trim().toLowerCase());
  const expectedCols = ['name', 'sku', 'category', 'cost_price', 'sale_price', 'initial_stock'];
  const missingCols = expectedCols.filter(col => !headers.includes(col));

  const rows = [];
  const errors = [];
  const seenSkus = new Set();

  for (let i = 1; i < lines.length; i++) {
    const rawCols = splitCsvLine(lines[i]);
    if (rawCols.length === 0 || (rawCols.length === 1 && !rawCols[0].trim())) continue;

    const rowObj = {};
    headers.forEach((h, index) => {
      rowObj[h] = (rawCols[index] || '').trim();
    });

    const rowErrors = [];
    if (!rowObj.name) rowErrors.push('Product name is required.');
    if (!rowObj.sku) {
      rowErrors.push('SKU is required.');
    } else if (seenSkus.has(rowObj.sku.toUpperCase())) {
      rowErrors.push(`Duplicate SKU in file: "${rowObj.sku}".`);
    } else {
      seenSkus.add(rowObj.sku.toUpperCase());
    }

    const cost = parseFloat(rowObj.cost_price);
    const sale = parseFloat(rowObj.sale_price);
    if (isNaN(cost) || cost < 0) rowErrors.push('Cost price must be a valid non-negative number.');
    if (isNaN(sale) || sale < 0) rowErrors.push('Sale price must be a valid non-negative number.');
    if (!isNaN(cost) && !isNaN(sale) && sale < cost) {
      rowErrors.push('Warning: Sale price is lower than cost price.');
    }

    const stock = parseInt(rowObj.initial_stock, 10);
    if (isNaN(stock) || stock < 0) rowErrors.push('Initial stock must be a non-negative integer.');

    rows.push({
      line: i + 1,
      data: rowObj,
      isValid: rowErrors.filter(e => !e.startsWith('Warning')).length === 0,
      errors: rowErrors
    });

    if (rowErrors.length > 0) {
      errors.push(`Row ${i + 1}: ${rowErrors.join(' ')}`);
    }
  }

  return {
    headers,
    rows,
    errors,
    validCount: rows.filter(r => r.isValid).length,
    missingCols
  };
}

function splitCsvLine(line) {
  const result = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function getSampleProductCsv() {
  return `name,sku,category,cost_price,sale_price,initial_stock,unit,box_ratio
"Master Brass Padlock 50mm",LCK-PAD-050,cat_locks,850,1350,60,piece,12
"Heavy Duty Claw Hammer 16oz",TOL-HAM-016,cat_power_tools,650,1100,24,piece,1
"Concrete Screws 2-inch (Box of 200)",FST-CNC-200,cat_fasteners,900,1450,40,box,1
"Copper Wire 2.5mm Single Core (Coil 90M)",ELE-WIR-25,cat_electrical,4200,6100,15,coil,1
"PVC Ball Valve 3/4-inch",PLB-PVC-075,cat_plumbing,220,380,80,piece,10`;
}
