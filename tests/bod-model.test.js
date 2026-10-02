import test from "node:test";
import assert from "node:assert/strict";
import { calculateBodModel } from "../js/models/bod-model.js";
import { BOD_DEFAULTS } from "../js/models/parameters.js";

test("default BOD model is stable and removes most influent BOD", () => {
  const result = calculateBodModel(BOD_DEFAULTS);
  assert.equal(result.stable, true);
  assert.ok(result.effluentSubstrate < 4);
  assert.ok(result.bodRemoval > 0.98);
});

test("MCRT below the washout threshold produces no sustained biomass", () => {
  const result = calculateBodModel({ ...BOD_DEFAULTS, mcrt: 0.2 });
  assert.equal(result.stable, false);
  assert.equal(result.biomass, 0);
  assert.equal(result.effluentSubstrate, BOD_DEFAULTS.influentBod);
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
