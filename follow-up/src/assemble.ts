export interface ParcelRef {
  index: number;
  hash: string;
  size: number;
}

export interface Manifest {
  fileId: string;
  name: string;
  size: number;
  parcelSize: number;
  parcels: ParcelRef[];
}

/** Place verified parcels in index order. Missing indices are listed, not zero-filled. */
export function assembleParcels(
  manifest: Manifest,
  got: Map<number, Uint8Array>,
): { bytes: Uint8Array; complete: boolean; missing: number[] } {
  const missing = manifest.parcels.filter((p) => !got.has(p.index)).map((p) => p.index);
  const complete = missing.length === 0;
  const size = complete
    ? manifest.size
    : manifest.parcels.reduce((n, p) => n + (got.get(p.index)?.length ?? 0), 0);
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const p of manifest.parcels) {
    const part = got.get(p.index);
    if (!part) continue;
    bytes.set(part, at);
    at += part.length;
  }
  return { bytes, complete, missing };
}
