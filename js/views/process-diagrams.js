const fmt = (value, digits = 1) => new Intl.NumberFormat(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);

export function renderCodProcessMap(container) {
  container.innerHTML = `<svg class="process-svg" id="cod-process-svg" viewBox="0 0 1400 820" role="img" aria-label="COD concepts and material flows through an activated sludge process" preserveAspectRatio="xMidYMid meet">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"></path></marker>
      <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#16a34a"></path></marker>
      <marker id="arrow-orange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ea580c"></path></marker>
    </defs>
    <text class="section-label" x="28" y="48">Influent COD classification</text>
    <rect class="concept-box" x="28" y="72" width="180" height="70" rx="5"></rect><text class="symbol" x="118" y="101" text-anchor="middle">Sₜᵢ · total COD</text><text class="tiny" x="118" y="124" text-anchor="middle">Q · influent flow</text>
    <path class="flow-line" d="M208 107H260V198H300" style="stroke-width:8"></path><path class="flow-line" d="M208 107H240V345H300" style="stroke-width:3"></path><path class="flow-line" d="M208 107H225V485H300" style="stroke-width:4"></path>
    <rect class="concept-box" x="300" y="160" width="210" height="78" rx="5"></rect><text class="symbol" x="405" y="190" text-anchor="middle">Sᵦᵢ · biodegradable COD</text><text class="tiny" x="405" y="215" text-anchor="middle">Sᵦₛᵢ soluble + Sᵦₚᵢ particulate</text>
    <rect class="concept-box" x="300" y="306" width="210" height="78" rx="5"></rect><text class="symbol" x="405" y="336" text-anchor="middle">Sₙₛᵢ · soluble inert COD</text><text class="tiny" x="405" y="361" text-anchor="middle">passes through · fₙₛ</text>
    <rect class="concept-box" x="300" y="446" width="210" height="78" rx="5"></rect><text class="symbol" x="405" y="476" text-anchor="middle">Sₙₚᵢ · particulate inert COD</text><text class="tiny" x="405" y="501" text-anchor="middle">captured in floc · fₙₚ</text>

    <rect class="tank-shell" x="555" y="72" width="430" height="500" rx="8"></rect><text class="section-label" x="770" y="105" text-anchor="middle">Aeration tank · COD transformations</text><text class="tiny" x="770" y="128" text-anchor="middle">active and inactive organic sludge coexist in mixed liquor</text>
    <path class="flow-line" d="M510 199H600" style="stroke-width:8"></path><text class="tiny" x="558" y="154" text-anchor="middle">rᵤₛ · substrate uptake</text>
    <rect class="concept-box" x="615" y="150" width="150" height="96" rx="5"></rect><text class="symbol" x="690" y="178" text-anchor="middle">Xₐ · active</text><text class="tiny" x="690" y="199" text-anchor="middle">r_g · growth / synthesis</text><text class="tiny" x="690" y="218" text-anchor="middle">r_d · decay</text><text class="tiny" x="690" y="237" text-anchor="middle">r_e · wastage</text>
    <path class="oxygen-line" id="map-oex-flow" d="M510 224C555 245 565 286 615 286"></path><rect class="concept-box" x="615" y="251" width="150" height="72" rx="5"></rect><text class="symbol" x="690" y="281" text-anchor="middle">Oₑₓ</text><text class="tiny" x="690" y="305" text-anchor="middle">exogenous respiration</text>
    <path class="internal-line" id="map-xe-flow" d="M765 184C820 184 812 286 840 286"></path><rect class="concept-box" x="840" y="251" width="120" height="72" rx="5"></rect><text class="symbol" x="900" y="281" text-anchor="middle">Xₑ · endogenous</text><text class="tiny" x="900" y="305" text-anchor="middle">residue · fraction f</text>
    <path class="oxygen-line" id="map-oen-flow" d="M765 210C810 232 800 380 840 380"></path><rect class="concept-box" x="840" y="345" width="120" height="72" rx="5"></rect><text class="symbol" x="900" y="375" text-anchor="middle">Oₑₙ</text><text class="tiny" x="900" y="399" text-anchor="middle">endogenous respiration</text>
    <path class="internal-line" id="map-xi-flow" d="M510 485H615"></path><rect class="concept-box" x="615" y="449" width="150" height="72" rx="5"></rect><text class="symbol" x="690" y="479" text-anchor="middle">Xᵢ · influent inert</text><text class="tiny" x="690" y="503" text-anchor="middle">bioflocculated Sₙₚᵢ</text>
    <rect class="concept-box" x="790" y="450" width="170" height="80" rx="5"></rect><text class="symbol" x="875" y="478" text-anchor="middle">Xᵥ · organic sludge</text><text class="tiny" x="875" y="501" text-anchor="middle">Xₐ + Xₑ + Xᵢ</text><text class="tiny" x="875" y="519" text-anchor="middle">Xₜ adds inorganic Xₘ</text>
    <path class="internal-line" d="M765 196C790 196 780 458 790 478" style="stroke-width:3"></path><path class="internal-line" d="M840 287C795 310 790 440 805 468" style="stroke-width:3"></path><path class="internal-line" d="M765 485H790" style="stroke-width:3"></path>

    <path class="flow-line" d="M985 272H1030" style="stroke-width:8"></path><path class="clarifier-shell" d="M1030 158H1215L1180 405H1065Z"></path><text class="symbol" x="1122" y="191" text-anchor="middle">Secondary clarifier</text><text class="tiny" x="1122" y="214" text-anchor="middle">solid-liquid separation</text><text class="symbol" x="1122" y="257" text-anchor="middle">Xₐ · Xₑ · Xᵢ</text><text class="tiny" x="1122" y="280" text-anchor="middle">settle together as Xᵥ</text>
    <path class="flow-line" id="map-effluent" d="M1215 230H1370"></path><text class="symbol" x="1292" y="191" text-anchor="middle">Effluent Sₜₑ</text><text class="tiny" x="1292" y="212" text-anchor="middle">mainly Sₙₛᵢ · <tspan id="map-effluent-pct"></tspan></text>
    <path class="sludge-line" d="M1085 405V560H985V495" style="stroke-width:7"></path><text class="symbol" x="1015" y="587" text-anchor="middle">RAS · settled biomass recycle</text><text class="tiny" x="1015" y="607" text-anchor="middle">retains solids so Rₛ can exceed Rₕ</text>
    <path class="sludge-line" id="map-was" d="M1165 405V540"></path><text class="symbol" x="1190" y="477">WAS · excess sludge</text><text class="tiny" x="1190" y="499">r_e wastage controls Rₛ</text><text class="tiny" x="1190" y="520"><tspan id="map-was-pct"></tspan> of influent COD</text>
    <path class="oxygen-line" d="M690 323V417H760" style="stroke-width:3;marker-end:none"></path><path class="oxygen-line" d="M900 417H760" style="stroke-width:3;marker-end:none"></path><path class="oxygen-line" id="map-oxidized" d="M760 417C750 535 700 575 700 642"></path>
    <rect class="concept-box" x="610" y="642" width="180" height="104" rx="5"></rect><text class="symbol" x="700" y="670" text-anchor="middle">Oxidized COD</text><text class="tiny" x="700" y="692" text-anchor="middle">O₂ demand · <tspan id="map-oxidized-pct"></tspan></text><text class="tiny" x="700" y="714" text-anchor="middle">Oₑₓ <tspan id="map-oex-pct"></tspan> · exogenous</text><text class="tiny" x="700" y="734" text-anchor="middle">Oₑₙ <tspan id="map-oen-pct"></tspan> · endogenous</text>

    <text class="section-label" x="28" y="600">Operating and stoichiometric concepts</text><rect class="concept-box" x="28" y="622" width="170" height="94" rx="5"></rect><text class="symbol" x="113" y="650" text-anchor="middle">Rₕ · HRT</text><text class="tiny" x="113" y="674" text-anchor="middle">water residence time</text><text class="symbol" x="113" y="699" text-anchor="middle">Rₛ · SRT</text><rect class="concept-box" x="216" y="622" width="180" height="94" rx="5"></rect><text class="symbol" x="306" y="650" text-anchor="middle">Y · true yield</text><text class="tiny" x="306" y="674" text-anchor="middle">bₕ · decay coefficient</text><text class="tiny" x="306" y="699" text-anchor="middle">f · residue fraction</text><rect class="concept-box" x="414" y="622" width="180" height="94" rx="5"></rect><text class="symbol" x="504" y="650" text-anchor="middle">Cᵣ · production factor</text><text class="tiny" x="504" y="674" text-anchor="middle">f꜀ᵥ · COD/VSS</text><text class="tiny" x="504" y="699" text-anchor="middle">fᵥ · VSS/TSS</text>
    <text class="section-label" x="850" y="625">Clarifier solids inventory</text><rect class="concept-box" x="850" y="672" width="160" height="74" rx="5"></rect><text class="symbol" x="930" y="702" text-anchor="middle">Xₐ · active</text><text class="tiny" x="930" y="727" text-anchor="middle"><tspan id="map-xa-pct"></tspan> of organic sludge</text><rect class="concept-box" x="1032" y="672" width="160" height="74" rx="5"></rect><text class="symbol" x="1112" y="702" text-anchor="middle">Xₑ · endogenous</text><text class="tiny" x="1112" y="727" text-anchor="middle"><tspan id="map-xe-pct"></tspan> of organic sludge</text><rect class="concept-box" x="1214" y="672" width="160" height="74" rx="5"></rect><text class="symbol" x="1294" y="702" text-anchor="middle">Xᵢ · inert</text><text class="tiny" x="1294" y="727" text-anchor="middle"><tspan id="map-xi-pct"></tspan> of organic sludge</text>
    <path class="internal-line" id="map-xa-flow" d="M1090 405C1030 505 930 560 930 672"></path><path class="internal-line" id="map-xe-clarifier" d="M1122 405V672"></path><path class="internal-line" id="map-xi-clarifier" d="M1154 405C1215 505 1294 560 1294 672"></path>
    <text class="tiny" x="28" y="790">Arrow width follows the calculated COD fate or sludge-inventory fraction.</text>
  </svg>`;
}

function setText(container, id, value) {
  const element = container.querySelector(`#${id}`);
  if (element) element.textContent = value;
}

function setWidth(container, id, fraction, range = 14) {
  const element = container.querySelector(`#${id}`);
  if (element) element.style.strokeWidth = String(2 + range * Math.max(0, fraction));
}

export function updateCodProcessMap(container, result) {
  setText(container, "map-effluent-pct", `${fmt(100 * result.effluentFraction, 1)}% of influent COD`);
  setText(container, "map-was-pct", `${fmt(100 * result.sludgeCodFraction, 1)}%`);
  setText(container, "map-oxidized-pct", `${fmt(100 * result.oxidizedFraction, 1)}% of influent COD`);
  setText(container, "map-oex-pct", `${fmt(100 * result.exogenousOxygenFraction / result.oxidizedFraction, 1)}%`);
  setText(container, "map-oen-pct", `${fmt(100 * result.endogenousOxygenFraction / result.oxidizedFraction, 1)}%`);
  setText(container, "map-xa-pct", `${fmt(100 * result.activeInventory / result.organicInventory, 1)}%`);
  setText(container, "map-xe-pct", `${fmt(100 * result.endogenousInventory / result.organicInventory, 1)}%`);
  setText(container, "map-xi-pct", `${fmt(100 * result.inertInventory / result.organicInventory, 1)}%`);
  setWidth(container, "map-effluent", result.effluentFraction);
  setWidth(container, "map-was", result.sludgeCodFraction);
  setWidth(container, "map-oxidized", result.oxidizedFraction);
  setWidth(container, "map-oex-flow", result.exogenousOxygenFraction / result.oxidizedFraction, 9);
  setWidth(container, "map-oen-flow", result.endogenousOxygenFraction / result.oxidizedFraction, 9);
  setWidth(container, "map-xa-flow", result.activeInventory / result.organicInventory, 9);
  setWidth(container, "map-xe-flow", result.endogenousInventory / result.organicInventory, 9);
  setWidth(container, "map-xe-clarifier", result.endogenousInventory / result.organicInventory, 9);
  setWidth(container, "map-xi-flow", result.inertInventory / result.organicInventory, 9);
  setWidth(container, "map-xi-clarifier", result.inertInventory / result.organicInventory, 9);
}

export function enableDiagramNavigation(container, controls) {
  const svg = container.querySelector("svg");
  const base = { x: 0, y: 0, width: 1400, height: 820 };
  let view = { ...base };
  let drag = null;
  const apply = () => svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.width} ${view.height}`);
  const zoom = factor => {
    const width = Math.min(2200, Math.max(300, view.width * factor));
    const height = width * base.height / base.width;
    view = { x: view.x + (view.width - width) / 2, y: view.y + (view.height - height) / 2, width, height };
    apply();
  };
  controls.zoomIn.addEventListener("click", () => zoom(0.82));
  controls.zoomOut.addEventListener("click", () => zoom(1.22));
  controls.reset.addEventListener("click", () => { view = { ...base }; apply(); });
  container.addEventListener("wheel", event => { event.preventDefault(); zoom(event.deltaY < 0 ? 0.88 : 1.14); }, { passive: false });
  svg.addEventListener("pointerdown", event => { drag = { clientX: event.clientX, clientY: event.clientY, x: view.x, y: view.y }; svg.setPointerCapture(event.pointerId); });
  svg.addEventListener("pointermove", event => {
    if (!drag) return;
    const rect = container.getBoundingClientRect();
    view.x = drag.x - (event.clientX - drag.clientX) / rect.width * view.width;
    view.y = drag.y - (event.clientY - drag.clientY) / rect.height * view.height;
    apply();
  });
  const stop = event => { drag = null; if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId); };
  svg.addEventListener("pointerup", stop);
  svg.addEventListener("pointercancel", stop);
}
