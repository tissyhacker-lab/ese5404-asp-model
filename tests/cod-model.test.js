import test from "node:test";
import assert from "node:assert/strict";
import { calculateCodModel } from "../js/models/cod-model.js";
import { COD_DEFAULTS } from "../js/models/parameters.js";

test("COD balance closes for the course example", () => {
  const result = calculateCodModel(COD_DEFAULTS);
  assert.ok(Math.abs(result.codBalance - 1) < 1e-12);
  assert.ok(Math.abs(result.oxygenDemand - 4342.9) < 1);
});

test("organic sludge inventory is Xa + Xe + Xi", () => {
  const result = calculateCodModel(COD_DEFAULTS);
  assert.equal(
    result.organicInventory,
    result.activeInventory + result.endogenousInventory + result.inertInventory
  );
});

test("higher SRT increases endogenous and inert inventory", () => {
  const low = calculateCodModel({ ...COD_DEFAULTS, srt: 5 });
  const high = calculateCodModel({ ...COD_DEFAULTS, srt: 20 });
  assert.ok(high.endogenousInventory > low.endogenousInventory);
  assert.ok(high.inertInventory > low.inertInventory);
});

test("invalid COD fractions are rejected", () => {
  assert.throws(
    () => calculateCodModel({ ...COD_DEFAULTS, solubleInertFraction: 0.6, particulateInertFraction: 0.4 }),
    RangeError
  );
});
