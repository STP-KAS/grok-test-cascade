# Follow-up artifact

The review said the next useful thing was a failing-then-passing test:

> publisher funds, three founts hold disjoint parcels, gatherer pays per parcel, each fount claims above dust, liar is unpaid, incomplete file returns the bytes it actually has.

This directory is that artifact. It does **not** replace kascade. It is a patch-shaped spec.

## Run

```bash
npm install
npm test              # passing side (this repo)
npm run test:upstream # failing side against current kaspahttp402/kascade
```

`KASCADE_ROOT` can point at a kascade checkout. Default: the clone used for this review, then `node_modules/kascade`.

## What each side proves

| Command | Result | Meaning |
|---|---|---|
| `npm run test:upstream` | **fails** today | `fetchFile` returns a zero buffer when the file is incomplete |
| `npm test` | **passes** | incomplete assemble returns real parcels; publisher-pays keeps the viewer at 0; liar unpaid; claims below 2,600,000 sompi are held |

## What this is not

Not a live TN10 claim. Dust is enforced in settlement numbers, the same KIP-9 floor kascade already documented. On-chain claim still needs a funded gatherer key and the kaspa-x402 rail.
