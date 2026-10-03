import { COD_DEFAULTS, COD_PRESETS, BOD_DEFAULTS } from "./models/parameters.js";
import { calculateCodModel } from "./models/cod-model.js";
import { calculateBodModel } from "./models/bod-model.js";
import { COD_CONCEPTS, COD_EQUATIONS } from "./equations/cod-equations.js";
import { BOD_REFERENCE_GROUPS } from "./equations/bod-equations.js";
import { BOD_PARAMETER_REFERENCE } from "./equations/bod-parameter-reference.js";
import { drawStackChart, drawLegend } from "./views/cod-charts.js";
import { drawBodFlow, drawBodCurves, drawBodRelationships } from "./views/bod-charts.js";
import { renderCodProcessMap, updateCodProcessMap, enableDiagramNavigation } from "./views/process-diagrams.js";
import { renderGroupedReference, renderReferenceList } from "./views/reference-view.js";

const app = document.getElementById("asp-app");
const fmt = (value, digits = 1) => new Intl.NumberFormat(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);
const whole = value => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);

const COD_CONTROLS = [
  { type: "select", id: "cod-preset", label: "Influent preset", wide: true, options: [["example", "Course example"], ["raw", "Raw municipal sewage"], ["settled", "Pre-treated municipal sewage"]] },
  { id: "cod-srt", key: "srt", label: "SRT, Rₛ", min: 1, max: 40, step: 1, unit: "d", digits: 0 },
  { id: "cod-temperature", key: "temperature", label: "Temperature", min: 5, max: 35, step: 1, unit: "°C", digits: 0 },
  { id: "cod-influent", key: "influentCod", label: "Influent COD", min: 100, max: 1500, step: 10, unit: "mg/L", digits: 0 },
  { id: "cod-flow", key: "flow", label: "Flow, Q", min: 1000, max: 50000, step: 500, unit: "m³/d", digits: 0 },
  { id: "cod-target-xv", key: "targetXv", label: "Target Xᵥ", min: 1, max: 6, step: 0.1, unit: "g/L", digits: 1 },
  { id: "cod-fns", key: "solubleInertFraction", label: "Soluble inert, fₙₛ", min: 0, max: 0.3, step: 0.01, unit: "", digits: 2 },
  { id: "cod-fnp", key: "particulateInertFraction", label: "Particulate inert, fₙₚ", min: 0, max: 0.3, step: 0.01, unit: "", digits: 2 },
  { id: "cod-yield", key: "trueYield", label: "True yield, Y", min: 0.3, max: 0.6, step: 0.01, unit: "", digits: 2 },
  { id: "cod-residue", key: "decayResidueFraction", label: "Decay residue, f", min: 0.1, max: 0.3, step: 0.01, unit: "", digits: 2 },
  { id: "cod-fcv", key: "codPerVss", label: "COD/VSS, f꜀ᵥ", min: 1.2, max: 1.8, step: 0.05, unit: "", digits: 2 },
  { id: "cod-fv", key: "vssPerTss", label: "VSS/TSS, fᵥ", min: 0.6, max: 0.9, step: 0.01, unit: "", digits: 2 }
];

const BOD_CONTROLS = [
  { group: "Boundary conditions", note: "Fixed by the wastewater source or treatment objective", id: "bod-so", key: "influentBod", label: "Raw BOD₅, Sraw", min: 50, max: 600, step: 5, unit: "mg/L", digits: 0 },
  { group: "Boundary conditions", id: "bod-primary", key: "primaryRemovalFraction", label: "Primary removal, ηp", min: 0, max: 0.6, step: 0.01, unit: "", digits: 2 },
  { group: "Boundary conditions", id: "bod-target", key: "targetEffluentBod", label: "Effluent target, Starget", min: 5, max: 50, step: 1, unit: "mg/L", digits: 0 },
  { group: "Boundary conditions", id: "bod-flow-input", key: "flow", label: "Flow, Q", min: 1000, max: 50000, step: 500, unit: "m³/d", digits: 0 },
  { group: "Boundary conditions", id: "bod-tkn", key: "influentTkn", label: "Influent TKN", min: 0, max: 100, step: 2, unit: "mg/L", digits: 0 },
  { group: "Biokinetics", note: "Calibrated for the selected biomass, temperature, pH and wastewater", id: "bod-mum", key: "maximumGrowthRate", label: "Maximum growth, μₘ", min: 1, max: 10, step: 0.1, unit: "d⁻¹", digits: 1 },
  { group: "Biokinetics", id: "bod-ks", key: "halfVelocityConstant", label: "Half-velocity, Kₛ", min: 10, max: 150, step: 5, unit: "mg/L", digits: 0 },
  { group: "Biokinetics", id: "bod-kd", key: "decayCoefficient", label: "Decay, Kd", min: 0.02, max: 0.15, step: 0.005, unit: "d⁻¹", digits: 3 },
  { group: "Biokinetics", id: "bod-yield", key: "trueYield", label: "True yield, YT", min: 0.3, max: 0.8, step: 0.01, unit: "", digits: 2 },
  { group: "Biokinetics", id: "bod-k", key: "bodDecayConstant", label: "BOD test constant, K", min: 0.1, max: 0.4, step: 0.01, unit: "d⁻¹", digits: 2 },
  { group: "Design and operation", note: "Selected by the designer or operator", id: "bod-mcrt", key: "mcrt", label: "MCRT, θc", min: 0.1, max: 30, step: 0.1, unit: "d", digits: 1 },
  { group: "Design and operation", id: "bod-hrt", key: "hrtHours", label: "HRT, θ", min: 1, max: 24, step: 0.5, unit: "h", digits: 1 },
  { group: "Solids separation", note: "Clarifier and sludge-settling performance", id: "bod-xr", key: "returnSludgeVss", label: "RAS/WAS biomass, Xr", min: 3000, max: 16000, step: 250, unit: "mg/L", digits: 0 },
  { group: "Solids separation", id: "bod-xe", key: "effluentVss", label: "Effluent biomass, Xe", min: 0, max: 50, step: 1, unit: "mg/L", digits: 0 },
  { group: "Solids separation", id: "bod-svi", key: "svi", label: "SVI", min: 50, max: 300, step: 5, unit: "mL/g", digits: 0 },
  { group: "Solids separation", id: "bod-vss-tss", key: "vssPerTss", label: "VSS/TSS, γv", min: 0.5, max: 0.95, step: 0.01, unit: "", digits: 2 }
];

function renderControls(container, descriptors, defaults) {
  container.innerHTML = descriptors.map(control => {
    if (control.type === "select") {
      return `<div class="control wide"><div class="control-head"><label for="${control.id}">${control.label}</label></div><select id="${control.id}">${control.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></div>`;
    }
    return `<div class="control"><div class="control-head"><label for="${control.id}">${control.label}</label><output id="${control.id}-out"></output></div><input id="${control.id}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${defaults[control.key]}"></div>`;
  }).join("");
}

function renderGroupedControls(container, descriptors, defaults) {
  const groups = [...new Set(descriptors.map(control => control.group))];
  container.innerHTML = groups.map(group => {
    const controls = descriptors.filter(control => control.group === group);
    const note = controls.find(control => control.note)?.note || "";
    return `<fieldset class="control-group"><legend>${group}</legend>${note ? `<p class="group-note">${note}</p>` : ""}<div class="control-grid">${controls.map(control => `<div class="control"><div class="control-head"><label for="${control.id}">${control.label}</label><output id="${control.id}-out"></output></div><div class="control-inputs"><input id="${control.id}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${defaults[control.key]}"><input id="${control.id}-number" class="control-number" type="number" min="${control.min}" max="${control.max}" step="${control.step}" value="${defaults[control.key]}" aria-label="${control.label} numeric value"></div></div>`).join("")}</div></fieldset>`;
  }).join("");
}

function readValues(descriptors) {
  return Object.fromEntries(descriptors.filter(control => control.key).map(control => [control.key, Number(document.getElementById(control.id).value)]));
}

function refreshOutputs(descriptors) {
  descriptors.filter(control => control.key).forEach(control => {
    const value = Number(document.getElementById(control.id).value);
    document.getElementById(`${control.id}-out`).textContent = `${fmt(value, control.digits)}${control.unit ? ` ${control.unit}` : ""}`;
  });
}

function text(id, value) {
  document.getElementById(id).textContent = value;
}

renderControls(document.getElementById("cod-controls"), COD_CONTROLS, COD_DEFAULTS);
renderGroupedControls(document.getElementById("bod-controls"), BOD_CONTROLS, BOD_DEFAULTS);
renderReferenceList(document.getElementById("cod-concepts"), COD_CONCEPTS);
renderReferenceList(document.getElementById("cod-equations"), COD_EQUATIONS.map(([id, formula]) => [id, "", formula]), true);
renderGroupedReference(document.getElementById("bod-concepts"), BOD_REFERENCE_GROUPS);

const tableBody = document.getElementById("bod-parameter-table");
const tableFilter = document.getElementById("bod-table-filter");
const tableClasses = ["All", ...new Set(BOD_PARAMETER_REFERENCE.map(row => row[4]))];
function renderParameterTable(filter = "All") {
  tableBody.innerHTML = BOD_PARAMETER_REFERENCE.filter(row => filter === "All" || row[4] === filter).map(row => `<tr><td class="symbol-cell">${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td><span class="class-tag">${row[4]}</span></td></tr>`).join("");
  [...tableFilter.children].forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
}
tableFilter.innerHTML = tableClasses.map((name, index) => `<button type="button" class="filter-button" data-filter="${name}" aria-pressed="${index === 0}">${name}</button>`).join("");
tableFilter.addEventListener("click", event => { if (event.target.dataset.filter) renderParameterTable(event.target.dataset.filter); });
renderParameterTable();

const diagram = document.getElementById("cod-diagram");
renderCodProcessMap(diagram);
enableDiagramNavigation(diagram, {
  zoomIn: document.getElementById("zoom-in"),
  zoomOut: document.getElementById("zoom-out"),
  reset: document.getElementById("zoom-reset")
});

function updateCod() {
  const error = document.getElementById("cod-error");
  try {
    const result = calculateCodModel(readValues(COD_CONTROLS));
    error.hidden = true;
    refreshOutputs(COD_CONTROLS);
    text("cod-status", `COD balance: ${fmt(100 * result.codBalance, 1)}%`);
    text("cod-bh", `bₕ = ${fmt(result.bh, 3)} d⁻¹`);
    text("cod-active", `Active = ${fmt(100 * result.activeVssFraction, 1)}% of VSS; ${fmt(100 * result.activeTssFraction, 1)}% of TSS`);
    const fateValues = [result.effluentFraction, result.sludgeCodFraction, result.oxidizedFraction];
    const fateLabels = ["Effluent", "Excess sludge", "Oxidized"];
    drawStackChart(document.getElementById("cod-fate-chart"), fateValues, fateLabels);
    drawLegend(document.getElementById("cod-fate-legend"), fateLabels, fateValues);
    const sludgeValues = [result.activeInventory, result.endogenousInventory, result.inertInventory];
    const sludgeLabels = ["Active", "Endogenous", "Influent inert"];
    drawStackChart(document.getElementById("cod-sludge-chart"), sludgeValues, sludgeLabels);
    drawLegend(document.getElementById("cod-sludge-legend"), sludgeLabels, sludgeValues);
    text("cod-oxygen", `${whole(result.oxygenDemand)} kg O₂/d`);
    text("cod-oxygen-context", `Exogenous ${fmt(100 * result.exogenousOxygenFraction / result.oxidizedFraction, 0)}% · endogenous ${fmt(100 * result.endogenousOxygenFraction / result.oxidizedFraction, 0)}%`);
    text("cod-sludge", `${whole(result.excessTss)} kg TSS/d`);
    text("cod-sludge-context", `${whole(result.excessVss)} kg VSS/d · observed yield ${fmt(result.observedVssYield, 3)}`);
    text("cod-volume", `${whole(result.reactorVolume)} m³`);
    text("cod-volume-context", `HRT ${fmt(24 * result.hrtDays, 1)} h · inventory ${whole(result.organicMass)} kg VSS`);
    text("cod-effluent", `Effluent inert COD: ${fmt(result.effluentCod, 1)} mg/L`);
    text("cod-nutrients", `Minimum N/P: ${fmt(result.nitrogenRequirement, 1)} / ${fmt(result.phosphorusRequirement, 1)} mg/L`);
    text("cod-fm", `F/M: ${fmt(result.fmRatio, 3)} kg COD/(kg VSS·d)`);
    updateCodProcessMap(diagram, result);
    localStorage.setItem("ese5404-cod", JSON.stringify(readValues(COD_CONTROLS)));
  } catch (exception) {
    error.textContent = exception.message;
    error.hidden = false;
  }
}

function updateBod() {
  const error = document.getElementById("bod-error");
  try {
    const parameters = { ...BOD_DEFAULTS, ...readValues(BOD_CONTROLS) };
    const result = calculateBodModel(parameters);
    error.hidden = true;
    refreshOutputs(BOD_CONTROLS);
    text("bod-status", result.stable ? "Stable biomass" : "Washout");
    document.getElementById("bod-status").classList.toggle("error", !result.stable);
    text("bod-critical", `washout below θc ≈ ${fmt(result.washoutMcrt, 2)} d`);
    text("bod-s", `${fmt(result.effluentSubstrate, 1)} mg/L`);
    text("bod-removal", `${fmt(100 * result.bodRemoval, 1)}% overall · target ${result.meetsTarget ? "met" : "not met"}`);
    text("bod-x", `${whole(result.biomass)} mg/L`);
    text("bod-volume", `${whole(result.reactorVolume)} m³ reactor volume`);
    text("bod-o2", `${whole(result.carbonaceousOxygen)} kg O₂/d`);
    text("bod-sludge", `${whole(result.excessVss)} kg VSS/d excess sludge`);
    text("bod-fm", `F/M: ${Number.isFinite(result.fmRatio) ? fmt(result.fmRatio, 3) : "n/a"} kg BOD/(kg VSS·d)`);
    text("bod-q", `q: ${fmt(result.substrateUtilizationRate, 3)} kg BOD/(kg VSS·d)`);
    text("bod-r", `Recycle ratio R: ${Number.isFinite(result.recycleRatio) ? fmt(Math.max(0, result.recycleRatio), 2) : "n/a"}`);
    text("bod-qw", `WAS Qw: ${fmt(result.wasteFlow, 1)} m³/d`);
    text("bod-nod", `NOD: ${whole(result.nitrogenousOxygen)} kg O₂/d`);
    text("bod-xrmax", `Xr,max from SVI: ${whole(result.maximumReturnSludgeVss)} mg VSS/L`);
    drawBodCurves(document.getElementById("bod-curve"), result, mcrt => calculateBodModel(parameters, mcrt), mcrt => {
      const slider = document.getElementById("bod-mcrt");
      const number = document.getElementById("bod-mcrt-number");
      slider.value = mcrt;
      number.value = mcrt;
      updateBod();
    });
    drawBodFlow(document.getElementById("bod-flow"), result);
    drawBodRelationships(document.getElementById("bod-relationships"), result);
    text("bod-balance", `solids balance ${fmt(100 * result.solidsBalance, 1)}%`);
    localStorage.setItem("ese5404-bod", JSON.stringify(parameters));
  } catch (exception) {
    error.textContent = exception.message;
    error.hidden = false;
  }
}

document.getElementById("cod-preset").addEventListener("change", event => {
  const preset = COD_PRESETS[event.target.value];
  document.getElementById("cod-fns").value = preset.solubleInertFraction;
  document.getElementById("cod-fnp").value = preset.particulateInertFraction;
  updateCod();
});
COD_CONTROLS.filter(control => control.key).forEach(control => document.getElementById(control.id).addEventListener("input", updateCod));
BOD_CONTROLS.forEach(control => {
  const range = document.getElementById(control.id);
  const number = document.getElementById(`${control.id}-number`);
  range.addEventListener("input", () => { number.value = range.value; updateBod(); });
  number.addEventListener("input", () => {
    if (number.value === "") return;
    range.value = Math.min(control.max, Math.max(control.min, Number(number.value)));
    updateBod();
  });
});

const tabs = [...app.querySelectorAll("[role=tab]")];
tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(candidate => candidate.setAttribute("aria-selected", String(candidate === tab)));
  [...app.querySelectorAll("[role=tabpanel]")].forEach(page => { page.hidden = page.id !== tab.getAttribute("aria-controls"); });
  if (tab.id === "tab-bod") requestAnimationFrame(updateBod);
}));

new ResizeObserver(() => {
  if (!document.getElementById("page-cod").hidden) updateCod();
  if (!document.getElementById("page-bod").hidden) updateBod();
}).observe(app);

updateCod();
updateBod();
