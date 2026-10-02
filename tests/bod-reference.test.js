import test from "node:test";
import assert from "node:assert/strict";
import { BOD_REFERENCE_GROUPS } from "../js/equations/bod-equations.js";

test("BOD reference keeps equations 1 through 26 individually numbered", () => {
  const ids = BOD_REFERENCE_GROUPS.flatMap(group => group.relations.map(relation => Number(relation.id)));
  assert.deepEqual(ids, Array.from({ length: 26 }, (_, index) => index + 1));
});

test("displayed divisions use stacked fractions instead of slash notation", () => {
  const visibleFormulaText = BOD_REFERENCE_GROUPS
    .flatMap(group => group.relations)
    .map(relation => relation.formula.replace(/<[^>]+>/g, ""))
    .join(" ");

  assert.doesNotMatch(visibleFormulaText, /\//);
  assert.match(
    BOD_REFERENCE_GROUPS[0].relations[0].formula,
    /class="fraction"/
  );
});
