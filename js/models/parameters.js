export const COD_DEFAULTS = Object.freeze({
  srt: 10,
  temperature: 14,
  influentCod: 800,
  flow: 10000,
  targetXv: 3,
  solubleInertFraction: 0.05,
  particulateInertFraction: 0.15,
  trueYield: 0.45,
  decayResidueFraction: 0.20,
  codPerVss: 1.50,
  vssPerTss: 0.80
});

export const COD_PRESETS = Object.freeze({
  example: { solubleInertFraction: 0.05, particulateInertFraction: 0.15 },
  raw: { solubleInertFraction: 0.10, particulateInertFraction: 0.10 },
  settled: { solubleInertFraction: 0.20, particulateInertFraction: 0.02 }
});

export const BOD_DEFAULTS = Object.freeze({
  influentBod: 200,
  flow: 10000,
  mcrt: 8,
  hrtHours: 4,
  maximumGrowthRate: 5,
  halfVelocityConstant: 75,
  decayCoefficient: 0.08,
  trueYield: 0.50,
  returnSludgeVss: 10000,
  bodDecayConstant: 0.23,
  influentTkn: 40,
  svi: 100,
  vssPerTss: 0.80
});
