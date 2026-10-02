const fmt = (value, digits = 1) => new Intl.NumberFormat(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);
const whole = value => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);

export function drawBodFlow(container, result) {
  container.innerHTML = `<svg viewBox="0 0 760 300" role="img" aria-label="BOD activated sludge process">
    <defs>
      <marker id="bod-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"></path></marker>
      <marker id="bod-return-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ea580c"></path></marker>
    </defs>
    <path class="arrow" d="M28 138H190"></path><text x="28" y="108">Influent</text><text x="28" y="128">Q=${whole(result.flow)} m³/d · S₀=${fmt(result.influentBod, 0)} mg/L</text>
    <rect class="tank" x="190" y="78" width="250" height="125" rx="5"></rect><text x="315" y="106" text-anchor="middle" font-weight="600">Aeration tank</text><text x="315" y="134" text-anchor="middle">V=${whole(result.reactorVolume)} m³ · θ=${fmt(result.hrtHours, 1)} h</text><text x="315" y="160" text-anchor="middle">X=${result.stable ? whole(result.biomass) : "0"} mg/L</text><text x="315" y="185" text-anchor="middle">Monod growth - decay</text>
    <path class="arrow" d="M440 138H520"></path><path class="settler" d="M520 72H650L625 208H545Z"></path><text x="585" y="104" text-anchor="middle" font-weight="600">Clarifier</text>
    <path class="arrow" d="M650 138H744"></path><text x="665" y="108">Effluent</text><text x="665" y="128">S=${fmt(result.effluentSubstrate, 1)} mg/L</text>
    <path class="return-arrow" d="M585 208V256H360V204"></path><text x="475" y="282" text-anchor="middle">RAS · R=${Number.isFinite(result.recycleRatio) ? fmt(Math.max(0, result.recycleRatio), 2) : "n/a"} · Xᵣ=${whole(result.returnSludgeVss)} mg/L</text><path class="return-arrow" d="M620 208V270"></path>
  </svg>`;
}

export function drawBodCurves(container, current, calculateAtMcrt) {
  const width = Math.max(360, Math.floor(container.clientWidth || 700));
  const height = 360;
  const left = 56;
  const right = 18;
  const values = [];
  for (let mcrt = 0.3; mcrt <= 30; mcrt += 0.25) {
    const result = calculateAtMcrt(mcrt);
    values.push({ mcrt, substrate: result.effluentSubstrate, biomass: result.biomass });
  }
  const maximumSubstrate = current.influentBod;
  const maximumBiomass = Math.max(1, ...values.map(value => value.biomass));
  const x = value => left + (width - left - right) * (value - 0.3) / 29.7;
  const ySubstrate = value => 28 + 112 * (1 - value / maximumSubstrate);
  const yBiomass = value => 205 + 112 * (1 - value / maximumBiomass);
  const path = (key, y) => values.map((value, index) => `${index ? "L" : "M"}${x(value.mcrt).toFixed(1)} ${y(value[key]).toFixed(1)}`).join(" ");
  const ticks = [0.3, 5, 10, 15, 20, 25, 30].map(value => `<line class="gridline" x1="${x(value)}" y1="28" x2="${x(value)}" y2="317"></line><text x="${x(value)}" y="342" text-anchor="middle">${value === 0.3 ? ".3" : value}</text>`).join("");
  container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Effluent substrate and biomass versus MCRT"><rect class="frame" x="${left}" y="28" width="${width - left - right}" height="112"></rect><rect class="frame" x="${left}" y="205" width="${width - left - right}" height="112"></rect>${ticks}<path class="s-line" d="${path("substrate", ySubstrate)}"></path><path class="x-line" d="${path("biomass", yBiomass)}"></path><line class="current" x1="${x(current.mcrt)}" y1="28" x2="${x(current.mcrt)}" y2="317"></line><text x="8" y="45">S</text><text x="8" y="63">mg/L</text><text x="8" y="222">X</text><text x="8" y="240">mg/L</text><text x="${width / 2}" y="358" text-anchor="middle">MCRT θc (d)</text><text x="${left + 4}" y="48">${fmt(maximumSubstrate, 0)}</text><text x="${left + 4}" y="225">${whole(maximumBiomass)}</text></svg>`;
}
