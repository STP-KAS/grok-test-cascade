/**
 * The next useful artifact: failing-then-passing behaviour kascade does not pin yet.
 *
 * This file is the passing side. `npm run test:upstream` is the failing side against
 * current kaspahttp402/kascade: incomplete fetchFile returns a zero buffer.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import { assembleParcels } from "./assemble.ts";
import { DUST_SOMPI, settlePublisherPays } from "./publisher-pays.ts";
import { loadKascade } from "./kascade.ts";

const file = (n: number): Uint8Array => Uint8Array.from({ length: n }, (_, i) => (i * 31 + 7) % 251);
const listen = (s: Server) => new Promise<void>((r) => s.listen(0, "127.0.0.1", () => r()));
const close = (s: Server) => new Promise<void>((r) => s.close(() => r()));

test("incomplete file returns the bytes it actually has, in index order", () => {
  const parcels = [
    { index: 0, hash: "a", size: 3 },
    { index: 1, hash: "b", size: 3 },
    { index: 2, hash: "c", size: 2 },
  ];
  const manifest = { fileId: "x", name: "p.bin", size: 8, parcelSize: 3, parcels };
  const got = new Map<number, Uint8Array>([
    [0, Uint8Array.from([1, 2, 3])],
    [2, Uint8Array.from([7, 8])],
  ]);
  const out = assembleParcels(manifest, got);
  assert.equal(out.complete, false);
  assert.deepEqual([...out.missing], [1]);
  assert.deepEqual([...out.bytes], [1, 2, 3, 7, 8]);
  assert.ok([...out.bytes].some((b) => b !== 0), "must not be a zero buffer");
});

test("publisher funds, three disjoint founts, gatherer pays per parcel, liar unpaid, claims above dust", async () => {
  const { buildManifest, fetchFile, fount } = await loadKascade();
  const PRICE = 20;
  const bytes = file(700_000);
  const m = buildManifest("movie.bin", bytes, 64 * 1024);
  const cut = new Map(m.parcels.map((p: { index: number }) => [p.index, bytes.subarray(p.index * m.parcelSize, p.index * m.parcelSize + p.size)]));
  const honest = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10],
  ];
  const held = (idx: number[]) => [{ manifest: m, parcels: new Map(idx.map((i) => [i, cut.get(i) as Uint8Array])) }];
  const founts = honest.map((idx) => fount({ held: held(idx), priceSompi: PRICE }));
  const liar = fount({
    held: held(m.parcels.map((p: { index: number }) => p.index)),
    priceSompi: PRICE,
    tamper: (b: Uint8Array) => {
      const t = Uint8Array.from(b);
      t[0] = (t[0] ?? 0) ^ 0x01;
      return t;
    },
  });
  await Promise.all([...founts, liar].map((f) => listen(f.server)));
  try {
    const holders = [
      { url: liar.url(), indices: m.parcels.map((p: { index: number }) => p.index) },
      ...founts.map((f, i) => ({ url: f.url(), indices: honest[i] as number[] })),
    ];
    const { bytes: got, receipt } = await fetchFile({
      manifest: m,
      holders,
      priceSompi: PRICE,
      concurrency: 1,
    });
    assert.equal(receipt.complete, true);
    assert.deepEqual(got, bytes);

    const assembled = assembleParcels(
      m,
      new Map(m.parcels.map((p: { index: number }) => [p.index, bytes.subarray(p.index * m.parcelSize, p.index * m.parcelSize + p.size)])),
    );
    assert.equal(assembled.complete, true);

    const settlement = settlePublisherPays({
      budgetSompi: 20_000_000,
      perFount: receipt.perFount,
      faults: receipt.faults,
    });
    assert.equal(settlement.viewerPaidSompi, 0, "viewer does not pay");
    assert.ok(settlement.unpaidLiar.includes(liar.url()), "liar is unpaid");
    assert.equal(receipt.perFount[liar.url()], undefined);
    assert.equal(settlement.pay.length, 3, "three honest founts");
    for (const p of settlement.pay) {
      assert.ok(p.sompi >= DUST_SOMPI, `claim ${p.sompi} must clear dust ${DUST_SOMPI}`);
    }
    const paid = settlement.pay.reduce((n, p) => n + p.sompi, 0);
    assert.equal(paid, receipt.totalSompi);
    assert.equal(settlement.remaining, 20_000_000 - paid);
  } finally {
    await Promise.all([...founts, liar].map((f) => close(f.server)));
  }
});

test("a claim below dust is held, not paid, even if the parcels verified", () => {
  const s = settlePublisherPays({
    budgetSompi: 10_000_000,
    perFount: { "http://tiny": { parcels: 1, bytes: 100, sompi: 2_000 } },
    faults: [],
  });
  assert.deepEqual(s.pay, []);
  assert.deepEqual(s.belowDust, [{ url: "http://tiny", sompi: 2_000 }]);
  assert.equal(s.remaining, 10_000_000);
});
