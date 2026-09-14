/**
 * Failing against current kaspahttp402/kascade.
 *
 * fetchFile allocates a buffer of size bytesGot when incomplete, then only copies
 * parcels if complete. The returned bytes are zeros. Receipt is honest; the buffer is not.
 *
 * Exit 1 is the point. After upstream copies parcels in index order, this test should pass
 * and can be deleted.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import { loadKascade } from "./kascade.ts";

const file = (n: number): Uint8Array => Uint8Array.from({ length: n }, (_, i) => (i * 31 + 7) % 251);
const listen = (s: Server) => new Promise<void>((r) => s.listen(0, "127.0.0.1", () => r()));
const close = (s: Server) => new Promise<void>((r) => s.close(() => r()));

test("upstream fetchFile returns the parcels that arrived when the file is incomplete", async () => {
  const { buildManifest, fetchFile, fount } = await loadKascade();
  const bytes = file(200_000);
  const m = buildManifest("data.bin", bytes, 64 * 1024);
  const all = new Map(m.parcels.map((c) => [c.index, bytes.subarray(c.index * m.parcelSize, c.index * m.parcelSize + c.size)]));
  const p = fount({
    held: [{ manifest: m, parcels: new Map([[0, all.get(0) as Uint8Array], [1, all.get(1) as Uint8Array]]) }],
    priceSompi: 2,
  });
  await listen(p.server);
  try {
    const { bytes: got, receipt } = await fetchFile({
      manifest: m,
      holders: [{ url: p.url(), indices: [0, 1] }],
      priceSompi: 2,
    });
    assert.equal(receipt.complete, false);
    assert.equal(receipt.parcelsGot, 2);
    assert.ok(got.length === receipt.bytesGot);
    assert.ok([...got].some((b) => b !== 0), "incomplete fetch must return real parcels, not zeros");
    assert.deepEqual(got.subarray(0, (all.get(0) as Uint8Array).length), all.get(0));
  } finally {
    await close(p.server);
  }
});
