export function calculateBodModel(p, mcrtOverride = p.mcrt) {
  const mcrt = mcrtOverride;
  const hrtDays = p.hrtHours / 24;
  const netGrowthAtInfluent = p.maximumGrowthRate * p.influentBod
    / (p.halfVelocityConstant + p.influentBod) - p.decayCoefficient;
  const washoutMcrt = netGrowthAtInfluent > 0 ? 1 / netGrowthAtInfluent : Infinity;
  const denominator = mcrt * (p.maximumGrowthRate - p.decayCoefficient) - 1;
  const rawEffluent = denominator > 0
    ? p.halfVelocityConstant * (1 + p.decayCoefficient * mcrt) / denominator
    : Infinity;
  const stable = Number.isFinite(rawEffluent)
    && rawEffluent < p.influentBod
    && mcrt > washoutMcrt;
  const effluentSubstrate = stable ? Math.max(0, rawEffluent) : p.influentBod;
  const biomass = stable
    ? p.trueYield * (p.influentBod - effluentSubstrate) * mcrt
      / ((1 + p.decayCoefficient * mcrt) * hrtDays)
    : 0;
  const reactorVolume = p.flow * hrtDays;
  const excessVss = biomass > 0 ? reactorVolume * biomass / (1000 * mcrt) : 0;
  const bod5Fraction = 1 - Math.exp(-5 * p.bodDecayConstant);
  const influentUltimateBod = p.influentBod / bod5Fraction;
  const effluentUltimateBod = effluentSubstrate / bod5Fraction;
  const carbonaceousOxygen = stable
    ? Math.max(0, p.flow * (influentUltimateBod - effluentUltimateBod) / 1000 - 1.42 * excessVss)
    : 0;
  const fmRatio = biomass > 0 ? p.influentBod / (hrtDays * biomass) : Infinity;
  const recycleDenominator = biomass > 0 ? 1 - p.returnSludgeVss / biomass : NaN;
  const recycleRatio = biomass > 0 && Math.abs(recycleDenominator) > 1e-9
    ? (hrtDays / mcrt - 1) / recycleDenominator
    : NaN;

  return {
    ...p,
    mcrt,
    hrtDays,
    washoutMcrt,
    stable,
    effluentSubstrate,
    biomass,
    reactorVolume,
    excessVss,
    carbonaceousOxygen,
    fmRatio,
    recycleRatio,
    nitrogenousOxygen: 4.57 * p.flow * p.influentTkn / 1000,
    maximumReturnSludgeVss: p.vssPerTss * 1e6 / p.svi,
    bodRemoval: stable ? (p.influentBod - effluentSubstrate) / p.influentBod : 0
  };
}
