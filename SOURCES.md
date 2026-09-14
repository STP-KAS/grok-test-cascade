# Sources

Review date: **14 September 2026**. Nothing here was modified upstream.

## Request

| Item | URL |
|---|---|
| Review request | https://x.com/bathtoob30/status/2099442457670754791 |
| Same-thread pitch | https://x.com/bathtoob30/status/2099277232443175216 |
| Profile | https://x.com/bathtoob30 |
| Linked Claude artifact | https://claude.ai/code/artifact/8de4170e-f975-4c40-9b96-f28d7e62d4e8 |
| GitHub account he is building in | https://github.com/kaspahttp402 |

The Claude artifact is login-walled. It was **not** reviewed. Public git is the review surface.

## GitHub account `kaspahttp402`

User, not an org. Created 2026-08-20. 6 public repos, 0 followers. User Pages root 404s.

| Repo | Created | Last push (as of review) | Default branch | License on GitHub | Pages |
|---|---|---|---|---|---|
| kaspa-x402 | 2026-08-29 | 2026-09-12 | master | MIT | no (archived) |
| metered-protocol | 2026-09-11 | 2026-09-12 | master | MIT | yes |
| spigot | 2026-09-11 | 2026-09-12 | master | MIT | yes |
| flume | 2026-09-12 | 2026-09-12 | master | none listed | yes |
| kascade | 2026-09-13 | 2026-09-14 | master | none listed (README says MIT) | https://kaspahttp402.github.io/kascade/ |
| quorum | 2026-09-13 | 2026-09-14 | master | none listed | yes |

kascade was the live tip at review time (`updated_at` 2026-09-14 10:29 UTC).

## Files read in kascade

READMEs plus:

- `src/manifest.ts`
- `src/consumer.ts`
- `src/settlement.ts`
- `src/settlement.test.ts`
- `src/meridian.test.ts`
- `src/tracker.ts`
- `src/fount.ts`
- `src/creditline.ts`
- `src/creditline.test.ts`
- `src/paidpull.ts`
- `src/paidpull.test.ts`
- `src/paidgather.ts`
- `src/seed.ts`
- `src/keys.ts`
- `src/wallet.ts`
- `src/channel.ts`
- `tools/prove-live-meridian.ts`
- `package.json`

Tests and live proofs were **read**, not re-run in this session. Claimed TN10 txids were not independently confirmed against an explorer in this pass.

## Sibling READMEs

- https://github.com/kaspahttp402/metered-protocol
- https://github.com/kaspahttp402/spigot
- https://github.com/kaspahttp402/flume
- https://github.com/kaspahttp402/quorum
- https://github.com/kaspahttp402/kaspa-x402 (retired notice)

Landing pages:

- https://kaspahttp402.github.io/kascade/
- https://kaspahttp402.github.io/spigot/
- https://kaspahttp402.github.io/flume/

## Author screenshots (same author)

Copied from his public X posts into `docs/author-screenshots/`. They are his landing-page copy, not this review's claims.

| File | Source post / page |
|---|---|
| `01-the-problem.jpg` | CDN concentration pitch |
| `02-ownership.jpg` | “infrastructure you own” pitch |
| `03-cascade-hero.jpg` | 500 MB video / 0.00050 KAS illustration |
| `04-flume-meter.jpg` | pay-per-second UI |
| `05-block-window.jpg` | 600-block window: 4 days vs 60 seconds |

## Related, not his

| Item | Why it is here |
|---|---|
| https://github.com/elldeeone/kaspa-x402 | Actual Kaspa x402 reference. His suite settles through this rail. |
| https://github.com/elldeeone/kaspa-x402/issues/13 | Parker’s RC1 review of that rail, same thread as the ask. |
| https://kaspa-x402.org | Canonical Kaspa x402 docs |

## What this review did not do

- Did not execute `npm test` or the live TN10 harnesses.
- Did not re-broadcast or re-claim any covenant.
- Did not audit the kaspa-x402 escrow.
- Did not read the gated Claude artifacts.
- Did not review mainnet readiness of Kaspa covenants.
