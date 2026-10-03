export function calculateBodModel(p, mcrtOverride = p.mcrt) {
  const mcrt = mcrtOverride;
  const hrtDays = p.hrtHours / 24;
  const primaryRemovalFraction = Math.min(0.95, Math.max(0, p.primaryRemovalFraction ?? 0));
  const aerationInfluentBod = p.influentBod * (1 - primaryRemovalFraction);
  const netGrowthAtInfluent = p.maximumGrowthRate * aerationInfluentBod
    / (p.halfVelocityConstant + aerationInfluentBod) - p.decayCoefficient;
  const washoutMcrt = netGrowthAtInfluent > 0 ? 1 / netGrowthAtInfluent : Infinity;
  const denominator = mcrt * (p.maximumGrowthRate - p.decayCoefficient) - 1;
  const rawEffluent = denominator > 0
    ? p.halfVelocityConstant * (1 + p.decayCoefficient * mcrt) / denominator
    : Infinity;
  const stable = Number.isFinite(rawEffluent)
    && rawEffluent < aerationInfluentBod
    && mcrt > washoutMcrt;
  const effluentSubstrate = stable ? Math.max(0, rawEffluent) : aerationInfluentBod;
  const biomass = stable
    ? p.trueYield * (aerationInfluentBod - effluentSubstrate) * mcrt
      / ((1 + p.decayCoefficient * mcrt) * hrtDays)
    : 0;
  const reactorVolume = p.flow * hrtDays;
  const solidsLossRate = biomass > 0 ? reactorVolume * biomass / (1000 * mcrt) : 0;
  const effluentVss = Math.max(0, p.effluentVss ?? 0);
  const wasteDenominator = p.returnSludgeVss - effluentVss;
  const wasteFlow = biomass > 0 && wasteDenominator > 0
    ? Math.max(0, (reactorVolume * biomass / mcrt - p.flow * effluentVss) / wasteDenominator)
    : 0;
  const effluentFlow = Math.max(0, p.flow - wasteFlow);
  const wastedVss = wasteFlow * p.returnSludgeVss / 1000;
  const effluentVssLoad = effluentFlow * effluentVss / 1000;
  const bod5Fraction = 1 - Math.exp(-5 * p.bodDecayConstant);
  const influentUltimateBod = aerationInfluentBod / bod5Fraction;
  const effluentUltimateBod = effluentSubstrate / bod5Fraction;
  const carbonaceousOxygen = stable
    ? Math.max(0, p.flow * (influentUltimateBod - effluentUltimateBod) / 1000 - 1.42 * solidsLossRate)
    : 0;
  const fmRatio = biomass > 0 ? aerationInfluentBod / (hrtDays * biomass) : Infinity;
  const substrateUtilizationRate = biomass > 0
    ? (aerationInfluentBod - effluentSubstrate) / (hrtDays * biomass)
    : 0;
  const specificGrowthRate = p.trueYield * substrateUtilizationRate;
  const recycleDenominator = p.flow * (p.returnSludgeVss - biomass);
  const recycleRatio = biomass > 0 && recycleDenominator > 0
    ? (p.flow * biomass - effluentFlow * effluentVss - wasteFlow * p.returnSludgeVss) / recycleDenominator
    : NaN;
  const mixedLiquorFlow = p.flow * (1 + Math.max(0, recycleRatio || 0));
  const primaryBodRemoved = p.flow * (p.influentBod - aerationInfluentBod) / 1000;
  const solidsBalance = solidsLossRate > 0 ? (wastedVss + effluentVssLoad) / solidsLossRate : 1;

  return {
    ...p,
    mcrt,
    hrtDays,
    washoutMcrt,
    stable,
    aerationInfluentBod,
    primaryRemovalFraction,
    primaryBodRemoved,
    effluentSubstrate,
    biomass,
    reactorVolume,
    excessVss: solidsLossRate,
    solidsLossRate,
    wasteFlow,
    effluentFlow,
    wastedVss,
    effluentVssLoad,
    solidsBalance,
    carbonaceousOxygen,
    fmRatio,
    substrateUtilizationRate,
    specificGrowthRate,
    recycleRatio,
    mixedLiquorFlow,
    nitrogenousOxygen: 4.57 * p.flow * p.influentTkn / 1000,
    maximumReturnSludgeVss: p.vssPerTss * 1e6 / p.svi,
    biologicalBodRemoval: stable ? (aerationInfluentBod - effluentSubstrate) / aerationInfluentBod : 0,
    bodRemoval: stable ? (p.influentBod - effluentSubstrate) / p.influentBod : primaryRemovalFraction,
    meetsTarget: effluentSubstrate <= p.targetEffluentBod
  };
}
