const number = (value, digits = 1) => new Intl.NumberFormat(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);

export function drawStackChart(container, values, labels) {
  const width = Math.max(320, Math.floor(container.clientWidth || 600));
  const total = values.reduce((sum, value) => sum + value, 0);
  const left = 8;
  const usable = width - 16;
  let x = left;
  const segments = values.map((value, index) => {
    const segmentWidth = usable * value / total;
    const center = x + segmentWidth / 2;
    const percentage = 100 * value / total;
    const markup = `<rect class="series-${index + 1}" x="${x}" y="22" width="${segmentWidth}" height="42"></rect>${segmentWidth >= 70 ? `<text class="chart-label" x="${center}" y="48" text-anchor="middle">${number(percentage, 1)}%</text>` : ""}`;
    x += segmentWidth;
    return markup;
  }).join("");
  container.innerHTML = `<svg viewBox="0 0 ${width} 92" role="img" aria-label="${labels.join(", ")}"><rect class="stack-track" x="${left}" y="22" width="${usable}" height="42"></rect>${segments}<text class="axis-text" x="${left}" y="84">0</text><text class="axis-text" x="${width - left}" y="84" text-anchor="end">100%</text></svg>`;
}

export function drawLegend(container, labels, values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  container.innerHTML = labels.map((label, index) => `<span class="legend-item"><i class="swatch series-${index + 1}"></i>${label}: ${number(100 * values[index] / total, 1)}%</span>`).join("");
}
