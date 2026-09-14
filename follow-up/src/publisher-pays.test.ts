import { test } from "node:test";
import assert from "node:assert/strict";
import { DUST_SOMPI, settlePublisherPays } from "./publisher-pays.ts";

test("publisher budget is the only money that moves", () => {
  const s = settlePublisherPays({
    budgetSompi: 8_000_000,
    perFount: {
      "http://a": { parcels: 2, bytes: 200_000, sompi: 4_000_000 },
      "http://b": { parcels: 1, bytes: 150_000, sompi: 3_000_000 },
    },
    faults: [],
  });
  assert.equal(s.viewerPaidSompi, 0);
  assert.equal(s.pay.length, 2);
  assert.equal(s.remaining, 1_000_000);
});

test("over-budget fount is not silently paid from the viewer", () => {
  const s = settlePublisherPays({
    budgetSompi: 3_000_000,
    perFount: { "http://a": { parcels: 2, bytes: 200_000, sompi: 4_000_000 } },
    faults: [],
  });
  assert.deepEqual(s.pay, []);
  assert.deepEqual(s.overBudget, [{ url: "http://a", sompi: 4_000_000 }]);
  assert.equal(s.remaining, 3_000_000);
});

test("dust floor matches the KIP-9 constraint kascade already documented", () => {
  assert.equal(DUST_SOMPI, 2_600_000);
});
