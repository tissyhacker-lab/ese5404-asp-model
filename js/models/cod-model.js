export function calculateCodModel(p) {
  const biodegradableFraction = 1 - p.solubleInertFraction - p.particulateInertFraction;
  if (biodegradableFraction <= 0) {
    throw new RangeError("Soluble and particulate inert fractions must sum to less than 1.");
  }
  if (p.srt <= 0 || p.flow <= 0 || p.influentCod <= 0 || p.targetXv <= 0) {
    throw new RangeError("SRT, flow, influent COD and target Xv must be positive.");
  }

  const bh = 0.24 * Math.pow(1.04, p.temperature - 20);
  const productionFactor = p.trueYield * p.srt / (1 + bh * p.srt);

  const activeInventory = biodegradableFraction * productionFactor;
  const endogenousInventory = activeInventory * p.decayResidueFraction * bh * p.srt;
  const inertInventory = p.particulateInertFraction * p.srt / p.codPerVss;
  const organicInventory = activeInventory + endogenousInventory + inertInventory;
  const totalInventory = organicInventory / p.vssPerTss;

  const observedVssYield = organicInventory / p.srt;
  const observedTssYield = observedVssYield / p.vssPerTss;
  const effluentFraction = p.solubleInertFraction;
  const sludgeCodFraction = p.codPerVss * observedVssYield;
  const exogenousOxygenFraction = biodegradableFraction * (1 - p.codPerVss * p.trueYield);
  const endogenousOxygenFraction = biodegradableFraction * p.codPerVss
    * (1 - p.decayResidueFraction) * bh * productionFactor;
  const oxidizedFraction = exogenousOxygenFraction + endogenousOxygenFraction;
  const codBalance = effluentFraction + sludgeCodFraction + oxidizedFraction;

  const influentCodLoad = p.flow * p.influentCod / 1000;
  const oxygenDemand = oxidizedFraction * influentCodLoad;
  const excessVss = observedVssYield * influentCodLoad;
  const excessTss = observedTssYield * influentCodLoad;
  const organicMass = organicInventory * influentCodLoad;
  const reactorVolume = organicMass / p.targetXv;
  const hrtDays = reactorVolume / p.flow;

  return {
    ...p,
    biodegradableFraction,
    bh,
    productionFactor,
    activeInventory,
    endogenousInventory,
    inertInventory,
    organicInventory,
    totalInventory,
    observedVssYield,
    observedTssYield,
    effluentFraction,
    sludgeCodFraction,
    exogenousOxygenFraction,
    endogenousOxygenFraction,
    oxidizedFraction,
    codBalance,
    influentCodLoad,
    oxygenDemand,
    excessVss,
    excessTss,
    organicMass,
    reactorVolume,
    hrtDays,
    fmRatio: 1 / organicInventory,
    activeVssFraction: activeInventory / organicInventory,
    activeTssFraction: p.vssPerTss * activeInventory / organicInventory,
    effluentCod: p.solubleInertFraction * p.influentCod,
    nitrogenRequirement: 0.10 * observedVssYield * p.influentCod,
    phosphorusRequirement: 0.025 * observedVssYield * p.influentCod
  };
}
