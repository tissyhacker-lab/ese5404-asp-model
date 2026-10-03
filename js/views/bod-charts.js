const fmt = (value, digits = 1) => new Intl.NumberFormat(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);
const whole = value => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function movingDots(path, count, color, duration, radius = 3) {
  return Array.from({ length: count }, (_, index) => `<circle r="${radius}" fill="${color}" opacity="0.9"><animateMotion path="${path}" dur="${duration}s" begin="-${(duration * index / count).toFixed(2)}s" repeatCount="indefinite"></animateMotion></circle>`).join("");
}

function biomassDots(x, y, width, height, biomass) {
  const count = Math.round(clamp(10 + biomass / 90, 10, 58));
  return Array.from({ length: count }, (_, index) => {
    const px = x + 10 + ((index * 47) % Math.max(20, width - 20));
    const py = y + 40 + ((index * 31) % Math.max(20, height - 50));
    const delay = (index % 9) * -0.28;
    return `<circle class="biomass-particle" cx="${px}" cy="${py}" r="${2 + index % 2}" style="animation-delay:${delay}s"></circle>`;
  }).join("");
}

export function drawBodFlow(container, result) {
  const tankX = 330;
  const tankY = 128;
  const tankHeight = 178;
  const tankWidth = 240 + 120 * clamp((result.hrtHours - 1) / 23, 0, 1);
  const clarifierX = tankX + tankWidth + 78;
  const outletX = 1090;
  const recycleRatio = Number.isFinite(result.recycleRatio) ? Math.max(0, result.recycleRatio) : 0;
  const mixedStroke = 4 + 3 * clamp(recycleRatio, 0, 1.5);
  const rasStroke = 2.5 + 3 * clamp(recycleRatio, 0, 1.5);
  const wasteFraction = result.flow ? result.wasteFlow / result.flow : 0;
  const wasteStroke = 2 + 18 * clamp(wasteFraction, 0, 0.15);
  const processY = 218;
  const mixedPath = `M${tankX + tankWidth} ${processY}H${clarifierX}`;
  const effluentPath = `M${clarifierX + 152} ${processY}H${outletX}`;
  const rasPath = `M${clarifierX + 78} 338V402H${tankX + 100}V306`;
  const influentPath = `M24 ${processY}H112`;
  const primaryPath = `M245 ${processY}H${tankX}`;
  container.innerHTML = `<svg viewBox="0 0 1120 470" role="img" aria-label="Animated BOD activated sludge process with primary settling, aeration, clarification, recycle and wasting">
    <defs>
      <marker id="bod-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#334155"></path></marker>
      <marker id="bod-blue-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2563eb"></path></marker>
      <marker id="bod-return-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ea580c"></path></marker>
      <clipPath id="at-clip"><rect x="${tankX}" y="${tankY}" width="${tankWidth}" height="${tankHeight}" rx="4"></rect></clipPath>
      <clipPath id="clarifier-clip"><path d="M${clarifierX} 122H${clarifierX + 152}L${clarifierX + 116} 338H${clarifierX + 38}Z"></path></clipPath>
    </defs>
    <text x="24" y="128" class="stage-title">Raw influent</text><text x="24" y="158">Q = ${whole(result.flow)} m³/d</text><text x="24" y="178">Sraw = ${fmt(result.influentBod, 0)} mg/L</text>
    <path class="water-line" style="stroke-width:4" d="${influentPath}"></path>${movingDots(influentPath, 7, "#2563eb", 3.4)}
    <rect class="primary-shell" x="112" y="126" width="133" height="184" rx="4"></rect><path class="settled-bed" d="M116 270H241V306H116Z"></path>
    <text x="178" y="112" text-anchor="middle" class="stage-title">Primary settling</text><text x="178" y="154" text-anchor="middle">ηp = ${fmt(result.primaryRemovalFraction, 2)}</text><text x="178" y="176" text-anchor="middle">removed = ${whole(result.primaryBodRemoved)} kg/d</text>
    <g class="settling-particles">${Array.from({ length: 9 }, (_, i) => `<circle cx="${128 + i * 12}" cy="${218 + i % 3 * 8}" r="3"></circle>`).join("")}</g><path class="sludge-line" d="M178 310V360"></path><text x="188" y="356">primary sludge</text>
    <path class="water-line" d="${primaryPath}"></path>${movingDots(primaryPath, 5, "#2563eb", 2.5)}<text x="258" y="182">S₀ = ${fmt(result.aerationInfluentBod, 1)} mg/L</text>
    <rect class="aeration-shell" x="${tankX}" y="${tankY}" width="${tankWidth}" height="${tankHeight}" rx="4"></rect><path class="water-fill" d="M${tankX + 3} ${tankY + 38}H${tankX + tankWidth - 3}V${tankY + tankHeight - 3}H${tankX + 3}Z"></path>
    <g clip-path="url(#at-clip)">${biomassDots(tankX, tankY, tankWidth, tankHeight, result.biomass)}</g>
    <text x="${tankX + 14}" y="${tankY + 23}" class="stage-title">Aeration tank</text><text x="${tankX + 14}" y="${tankY + 54}">V = ${whole(result.reactorVolume)} m³ · θ = ${fmt(result.hrtHours, 1)} h</text><text x="${tankX + 14}" y="${tankY + 75}">X = ${whole(result.biomass)} mg VSS/L · θc = ${fmt(result.mcrt, 1)} d</text><text x="${tankX + 14}" y="${tankY + 96}">μm = ${fmt(result.maximumGrowthRate, 2)} d⁻¹ · Ks = ${fmt(result.halfVelocityConstant, 0)} mg/L</text><text x="${tankX + 14}" y="${tankY + 117}">YT = ${fmt(result.trueYield, 2)} · Kd = ${fmt(result.decayCoefficient, 3)} d⁻¹</text><text x="${tankX + 14}" y="${tankY + 138}">q = ${fmt(result.substrateUtilizationRate, 3)} d⁻¹ · μ = ${fmt(result.specificGrowthRate, 3)} d⁻¹</text>
    <g class="air-bubbles">${Array.from({ length: 12 }, (_, i) => `<circle cx="${tankX + 18 + (i * 37) % (tankWidth - 35)}" cy="${tankY + tankHeight - 12}" r="${2 + i % 3}"></circle>`).join("")}</g><text x="${tankX + tankWidth / 2}" y="${tankY + tankHeight + 22}" text-anchor="middle">O₂ = ${whole(result.carbonaceousOxygen)} kg/d</text>
    <path class="water-line" style="stroke-width:${mixedStroke}" d="${mixedPath}"></path>${movingDots(mixedPath, 6, "#16a34a", 2.8, 3.5)}<text x="${clarifierX - 7}" y="96" text-anchor="end">Q(1+R) = ${whole(result.mixedLiquorFlow)} m³/d</text><text x="${clarifierX - 7}" y="116" text-anchor="end">X = ${whole(result.biomass)} · S = ${fmt(result.effluentSubstrate, 1)}</text>
    <path class="clarifier-shell" d="M${clarifierX} 122H${clarifierX + 152}L${clarifierX + 116} 338H${clarifierX + 38}Z"></path><path class="sludge-blanket" d="M${clarifierX + 25} 255H${clarifierX + 127}L${clarifierX + 116} 334H${clarifierX + 38}Z"></path><text x="${clarifierX + 76}" y="150" text-anchor="middle" class="stage-title">Secondary clarifier</text><text x="${clarifierX + 76}" y="171" text-anchor="middle">settling + thickening</text>
    <g clip-path="url(#clarifier-clip)" class="clarifier-particles">${Array.from({ length: 18 }, (_, i) => `<circle cx="${clarifierX + 28 + (i * 29) % 100}" cy="${185 + (i * 17) % 112}" r="3"></circle>`).join("")}</g>
    <path class="water-line" d="${effluentPath}"></path>${movingDots(effluentPath, 7, "#2563eb", 3)}<text x="${clarifierX + 168}" y="142" class="stage-title">Effluent</text><text x="${clarifierX + 168}" y="164">Q-Qw = ${whole(result.effluentFlow)} m³/d</text><text x="${clarifierX + 168}" y="186">S = ${fmt(result.effluentSubstrate, 1)} mg/L</text><text x="${clarifierX + 168}" y="207">Xe = ${fmt(result.effluentVss, 0)} mg VSS/L</text><text x="${clarifierX + 168}" y="254">target ${fmt(result.targetEffluentBod, 0)} mg/L: ${result.meetsTarget ? "PASS" : "FAIL"}</text>
    <path class="ras-line" style="stroke-width:${rasStroke}" d="${rasPath}"></path>${movingDots(rasPath, 12, "#ea580c", 5.8, 3.5)}<text x="${tankX + 118}" y="427">RAS: Qr = ${whole(recycleRatio * result.flow)} m³/d · R = ${fmt(recycleRatio, 2)} · Xr = ${whole(result.returnSludgeVss)} mg/L</text>
    <path class="was-line" style="stroke-width:${wasteStroke}" d="M${clarifierX + 116} 338V450"></path><text x="${clarifierX + 130}" y="374">WAS</text><text x="${clarifierX + 130}" y="394">Qw = ${fmt(result.wasteFlow, 1)} m³/d</text><text x="${clarifierX + 130}" y="414">Xr = ${whole(result.returnSludgeVss)} mg/L</text>
  </svg>`;
}

export function drawBodCurves(container, current, calculateAtMcrt, onMcrtChange) {
  const width = Math.max(520, Math.floor(container.clientWidth || 760));
  const height = 430;
  const left = 104;
  const right = 22;
  const topOne = 32;
  const panelHeight = 136;
  const topTwo = 226;
  const minimumMcrt = 0.1;
  const maximumMcrt = 30;
  const logMinimum = Math.log(minimumMcrt);
  const logSpan = Math.log(maximumMcrt) - logMinimum;
  const x = value => left + (width - left - right) * (Math.log(clamp(value, minimumMcrt, maximumMcrt)) - logMinimum) / logSpan;
  const inverseX = value => Math.exp(logMinimum + clamp((value - left) / (width - left - right), 0, 1) * logSpan);
  const values = Array.from({ length: 220 }, (_, index) => {
    const mcrt = Math.exp(logMinimum + logSpan * index / 219);
    const result = calculateAtMcrt(mcrt);
    return { mcrt, substrate: result.effluentSubstrate, biomass: result.biomass };
  });
  const maximumSubstrate = Math.max(1, current.aerationInfluentBod);
  const maximumBiomass = Math.max(1, ...values.map(value => value.biomass));
  const ySubstrate = value => topOne + panelHeight * (1 - clamp(value / maximumSubstrate, 0, 1));
  const yBiomass = value => topTwo + panelHeight * (1 - clamp(value / maximumBiomass, 0, 1));
  const path = (key, y) => values.map((value, index) => `${index ? "L" : "M"}${x(value.mcrt).toFixed(1)} ${y(value[key]).toFixed(1)}`).join(" ");
  const xTicks = [0.1, 0.3, 0.5, 1, 2, 3, 5, 10, 20, 30];
  const verticalGrid = xTicks.map(value => `<line class="gridline" x1="${x(value)}" y1="${topOne}" x2="${x(value)}" y2="${topTwo + panelHeight}"></line><text x="${x(value)}" y="390" text-anchor="middle">${value}</text>`).join("");
  const horizontalGrid = [0, 0.25, 0.5, 0.75, 1].map(fraction => {
    const yS = ySubstrate(maximumSubstrate * fraction);
    const yX = yBiomass(maximumBiomass * fraction);
    return `<line class="gridline" x1="${left}" y1="${yS}" x2="${width - right}" y2="${yS}"></line><text class="axis-value" x="${left - 8}" y="${yS + 4}" text-anchor="end">${fmt(maximumSubstrate * fraction, 0)}</text><line class="gridline" x1="${left}" y1="${yX}" x2="${width - right}" y2="${yX}"></line><text class="axis-value" x="${left - 8}" y="${yX + 4}" text-anchor="end">${whole(maximumBiomass * fraction)}</text>`;
  }).join("");
  const selectedX = x(current.mcrt);
  const targetY = ySubstrate(current.targetEffluentBod);
  container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Interactive logarithmic plots of effluent substrate and biomass versus MCRT"><rect class="frame" x="${left}" y="${topOne}" width="${width - left - right}" height="${panelHeight}"></rect><rect class="frame" x="${left}" y="${topTwo}" width="${width - left - right}" height="${panelHeight}"></rect>${verticalGrid}${horizontalGrid}<line class="target-line" x1="${left}" y1="${targetY}" x2="${width - right}" y2="${targetY}"></line><text class="target-label" x="${width - right - 5}" y="${targetY - 5}" text-anchor="end">target ${fmt(current.targetEffluentBod, 0)}</text><path class="s-line" d="${path("substrate", ySubstrate)}"></path><path class="x-line" d="${path("biomass", yBiomass)}"></path><line class="current" x1="${selectedX}" y1="${topOne}" x2="${selectedX}" y2="${topTwo + panelHeight}"></line><circle class="drag-handle" cx="${selectedX}" cy="${topOne + 8}" r="7"></circle><text x="12" y="${topOne + 18}">S (mg/L)</text><text x="12" y="${topTwo + 18}">X (mg/L)</text><text x="${width / 2}" y="420" text-anchor="middle">MCRT θc (d) · logarithmic scale</text><rect class="drag-overlay" x="${left}" y="${topOne}" width="${width - left - right}" height="${topTwo + panelHeight - topOne}"></rect></svg>`;
  const svg = container.querySelector("svg");
  const overlay = container.querySelector(".drag-overlay");
  const updateFromPointer = (event, bounds) => {
    const viewX = (event.clientX - bounds.left) * width / bounds.width;
    onMcrtChange(clamp(Math.round(inverseX(viewX) * 10) / 10, minimumMcrt, maximumMcrt));
  };
  overlay.addEventListener("pointerdown", event => {
    event.preventDefault();
    const bounds = svg.getBoundingClientRect();
    updateFromPointer(event, bounds);
    const move = moveEvent => updateFromPointer(moveEvent, bounds);
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  });
}

export function drawBodRelationships(container, result) {
  const recycle = Number.isFinite(result.recycleRatio) ? Math.max(0, result.recycleRatio) : 0;
  const nodes = [
    ["YT", fmt(result.trueYield, 2), "sets μ produced per q", 190, 55, "bio"],
    ["q", `${fmt(result.substrateUtilizationRate, 3)} d⁻¹`, "q = (S₀-S)·(θX)⁻¹", 55, 185, "bio"],
    ["Kd", `${fmt(result.decayCoefficient, 3)} d⁻¹`, "higher Kd: S↑, X↓", 190, 330, "bio"],
    ["S", `${fmt(result.effluentSubstrate, 1)} mg/L`, "higher θc → lower S", 660, 55, "state"],
    ["X", `${whole(result.biomass)} mg/L`, "higher θc: inventory ↑", 795, 185, "state"],
    ["R", fmt(recycle, 2), "set by clarifier mass balance", 660, 330, "operation"]
  ];
  const centerX = 470;
  const centerY = 208;
  const lines = nodes.map(node => `<line class="relationship-link ${node[5]}" x1="${centerX}" y1="${centerY}" x2="${node[3] + 80}" y2="${node[4] + 41}"></line>`).join("");
  const cards = nodes.map(node => `<g transform="translate(${node[3]} ${node[4]})"><rect class="relationship-node ${node[5]}" width="160" height="82" rx="6"></rect><text x="12" y="23" class="node-symbol">${node[0]}</text><text x="12" y="46" class="node-value">${node[1]}</text><text x="12" y="67" class="node-note">${node[2]}</text></g>`).join("");
  container.innerHTML = `<svg viewBox="0 0 1010 475" role="img" aria-label="Relationship map centered on mean cell residence time"><defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z"></path></marker></defs>${lines}${cards}<g transform="translate(390 167)"><circle class="relationship-center" cx="80" cy="41" r="70"></circle><text x="80" y="30" text-anchor="middle" class="center-symbol">θc</text><text x="80" y="55" text-anchor="middle" class="center-value">${fmt(result.mcrt, 1)} d</text><text x="80" y="76" text-anchor="middle" class="center-note">net growth = θc⁻¹</text></g><text x="505" y="458" text-anchor="middle" class="relationship-equation">μ = YT·q = θc⁻¹ + Kd  ·  S follows Monod kinetics  ·  X follows the biomass balance</text></svg>`;
}
