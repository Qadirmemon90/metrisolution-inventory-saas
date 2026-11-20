/**
 * MetriSolution Inventory ERP SaaS - Accessible Lightweight SVG Charts
 * High performance, zero-dependency charts styled with MetriSolution design tokens.
 */

export function renderLineChart({ data = [], width = 600, height = 220, strokeColor = '#6941C6', fillColor = 'rgba(105, 65, 198, 0.1)' }) {
  if (!data || data.length < 2) {
    return `<div class="chart-empty text-muted text-caption" style="text-align:center;padding:40px;">No trend data available</div>`;
  }

  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const values = data.map(d => d.value);
  const minVal = 0;
  const maxVal = Math.max(...values) * 1.15; // Give 15% headroom

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.value / maxVal) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Horizontal grid lines (4 levels)
  const gridLines = [0.25, 0.5, 0.75, 1.0].map(ratio => {
    const y = height - paddingY - ratio * chartHeight;
    const valText = Math.round(maxVal * ratio).toLocaleString();
    return `
      <line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="#E4E7EC" stroke-dasharray="3,3" />
      <text x="${paddingX - 8}" y="${y + 4}" font-size="10" fill="#98A2B3" text-anchor="end">${valText}</text>
    `;
  }).join('');

  // X axis labels
  const xLabels = points.map((p, i) => {
    if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
      return `<text x="${p.x}" y="${height - 6}" font-size="11" fill="#475467" text-anchor="middle">${p.label}</text>`;
    }
    return '';
  }).join('');

  // Interactive dots
  const dots = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2.5" class="chart-point">
      <title>${p.label}: Rs. ${p.value.toLocaleString()}</title>
    </circle>
  `).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="metric-svg-chart" style="width: 100%; height: auto; display: block;" role="img" aria-label="Sales Trend Chart">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.25" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaD}" fill="url(#chartGradient)" />
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${dots}
      ${xLabels}
    </svg>
  `;
}

export function renderBarChart({ data = [], width = 500, height = 220, barColor = '#6941C6' }) {
  if (!data || data.length === 0) return '';
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxVal = Math.max(...data.map(d => d.value)) * 1.2;
  const barWidth = Math.min(48, (chartWidth / data.length) * 0.65);
  const gap = chartWidth / data.length;

  const bars = data.map((d, i) => {
    const x = paddingX + i * gap + (gap - barWidth) / 2;
    const barH = (d.value / maxVal) * chartHeight;
    const y = height - paddingY - barH;
    return `
      <g class="chart-bar-group">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" fill="${barColor}" class="chart-bar">
          <title>${d.label}: Rs. ${d.value.toLocaleString()}</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" font-weight="600" fill="#101828" text-anchor="middle">
          ${d.value > 1000 ? (d.value / 1000).toFixed(0) + 'k' : d.value}
        </text>
        <text x="${x + barWidth / 2}" y="${height - 6}" font-size="11" fill="#475467" text-anchor="middle">
          ${d.label}
        </text>
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;" role="img" aria-label="Branch Comparison Bar Chart">
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="#E4E7EC" stroke-width="1.5" />
      ${bars}
    </svg>
  `;
}
