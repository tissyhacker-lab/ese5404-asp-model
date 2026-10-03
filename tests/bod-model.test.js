import test from "node:test";
import assert from "node:assert/strict";
import { calculateBodModel } from "../js/models/bod-model.js";
import { BOD_DEFAULTS } from "../js/models/parameters.js";

test("default BOD model is stable and removes most influent BOD", () => {
  const result = calculateBodModel(BOD_DEFAULTS);
  assert.equal(result.stable, true);
  assert.ok(result.effluentSubstrate < 4);
  assert.ok(result.bodRemoval > 0.98);
  assert.ok(Math.abs(result.aerationInfluentBod - 201) < 1e-9);
});

test("MCRT below the washout threshold produces no sustained biomass", () => {
  const result = calculateBodModel({ ...BOD_DEFAULTS, mcrt: 0.2 });
  assert.equal(result.stable, false);
  assert.equal(result.biomass, 0);
  assert.equal(result.effluentSubstrate, result.aerationInfluentBod);
});

test("increasing MCRT lowers soluble effluent substrate", () => {
  const shortMcrt = calculateBodModel({ ...BOD_DEFAULTS, mcrt: 4 });
  const longMcrt = calculateBodModel({ ...BOD_DEFAULTS, mcrt: 12 });
  assert.ok(longMcrt.effluentSubstrate < shortMcrt.effluentSubstrate);
});

test("MLVSS return concentration from SVI includes the volatile fraction", () => {
  const result = calculateBodModel(BOD_DEFAULTS);
  assert.equal(result.maximumReturnSludgeVss, 8000);
});

test("waste and effluent solids close the MCRT solids balance", () => {
  const result = calculateBodModel(BOD_DEFAULTS);
  assert.ok(result.wasteFlow > 0);
  assert.ok(Math.abs(result.solidsBalance - 1) < 1e-10);
});

test("specific growth and substrate utilization obey mu equals Y times q", () => {
  const result = calculateBodModel(BOD_DEFAULTS);
  assert.ok(Math.abs(result.specificGrowthRate - BOD_DEFAULTS.trueYield * result.substrateUtilizationRate) < 1e-12);
  assert.ok(Math.abs(result.specificGrowthRate - (1 / result.mcrt + BOD_DEFAULTS.decayCoefficient)) < 1e-10);
});
