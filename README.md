> **Experimental only. Not a product.** There is no spendable L1 stable on Kaspa, and no credible alternative on the horizon. Until the unit of account and the sequencing path are settled, production dapps are not a useful allocation of time or capital. [KASPAglobal](https://x.com/kaspaglobal/status/2100536064683176270) · [DISCLAIMER.md](DISCLAIMER.md)

# grok-test-cascade

Independent review of **Mosh Jan** ([@bathtoob30](https://x.com/bathtoob30)) / GitHub **[kaspahttp402](https://github.com/kaspahttp402)**.

He asked for a take on in-progress ideas. This repo is that take. Not a security audit. Not a mainnet-readiness claim. Not a rewrite of his code.

**Verdict:** the metering idea is real and the honesty about hard parts is rare. The CDN pitch is not what the code does. Do not confuse a working testnet prototype with a delivery network.

| | |
|---|---|
| Reviewed | 14 September 2026 |
| Ask | [x.com/bathtoob30/status/2099442457670754791](https://x.com/bathtoob30/status/2099442457670754791) |
| Code | [github.com/kaspahttp402](https://github.com/kaspahttp402) (6 public repos) |
| Focus | [kaspahttp402/kascade](https://github.com/kaspahttp402/kascade) plus the suite it sits on |
| Author | Grok (xAI), for [STP-KAS](https://github.com/STP-KAS) |

## Read this

1. **[REVIEW.md](REVIEW.md)** — original review. Not rewritten.
2. **[VERIFICATION.md](VERIFICATION.md)** — tests re-run, txid lookup, live `prove-live-paid.ts` on TN10 (gatherer empty).
3. **[follow-up/](follow-up/)** — failing-then-passing tests: publisher-pays, disjoint founts, dust, liar unpaid, incomplete bytes.
4. **[SOURCES.md](SOURCES.md)** — exact links and limits.

## Account at a glance

| Repo | Role | On-chain? | Stars |
|---|---|---|---|
| [metered-protocol](https://github.com/kaspahttp402/metered-protocol) | Two-sided metering spec + two implementations | TN10 escrow | 0 |
| [spigot](https://github.com/kaspahttp402/spigot) | One seller, pay-per-byte file | TN10 | 0 |
| [flume](https://github.com/kaspahttp402/flume) | Open-ended stream, pay until you stop | TN10 | 0 |
| [kascade](https://github.com/kaspahttp402/kascade) | Many sellers, content-addressed swarm | TN10 proofs exist | 0 |
| [quorum](https://github.com/kaspahttp402/quorum) | Pay compute only if workers agree | Logic only | 0 |
| [kaspa-x402](https://github.com/kaspahttp402/kaspa-x402) | Old gateway client | **Archived 2026-09-12.** Not the Kaspa x402 standard. | 4 |

GitHub user created **2026-08-20**. No profile bio, no user Pages site (`kaspahttp402.github.io` 404s). Per-repo Pages exist for the later work.

## One-line take

Build one publisher-pays file with the paid handshake. Stop selling a CDN, a phone mesh, and an agent marketplace until that exists.
