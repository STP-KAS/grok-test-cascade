# Verification addendum

**Date:** 14 September 2026  
**Original review:** [REVIEW.md](REVIEW.md) — **not edited**. This file is the extra pass.

The original limits were:

> Did not re-execute tests or TN10 scripts.  
> Did not verify his listed txids on an explorer in this pass.  
> Did not audit elldeeone/kaspa-x402 (Parker already filed issue 13 on that rail).  
> Did not treat the gated Claude docs as evidence.

This pass did those checks, within the limits below.

---

## 1. Tests and demo — ran

Clone: `kaspahttp402/kascade` master, Node v24.19.0.

```
npm test
ℹ tests 56
ℹ pass 56
ℹ fail 0
duration_ms 2399
```

README still says “10 tests”. The suite is 56. The extra coverage is real (creditline, paid gather, DHT-ish lookup, cache, seed, wallet helpers). That is a plus. The README is stale.

```
npm run kascade -- demo
```

In-process demo: 524,288-byte file, 8 parcels, 4 founts (one liar). Liar rejected on parcels 2 and 6. File byte-identical. Liar earned 0. Settlement plan paid A/B/C and listed the liar under SLASH (still a list, not a bond).

**TN10 scripts not re-broadcast.** `tools/prove-live.ts` and `prove-live-paid.ts` open real escrow. This machine has no `~/.kascade` keys. I did not generate one and I did not pull keys out of the offered Chrome wallet (see §5).

---

## 2. Listed txids — tried, not verifiable as published

kascade README only publishes **8-hex prefixes**:

| Claim | Prefix | api-tn10.kaspa.org |
|---|---|---|
| single-fount genesis | `1216fcf1…` | 422 Unprocessable Entity |
| single-fount claim | `8af4c616…` | 422 |
| multi-fount claims | `c76b04d4…` `b5fdc420…` `0f528347…` | 422 |
| `POST /transactions/search` with the prefix | | empty `[]` |

TN10 REST requires a full 64-hex id. Prefix search returns nothing. explorer-tn10.kaspa.org is paused.

**Those on-chain claims are not independently checkable from the README.** Full ids live only in the machine that ran the proof. That is a documentation defect, not proof the txs never happened.

Same shape in sibling READMEs (spigot `b518a530…` / `3422d275…`, flume `197541ef` / `529c40eb`).

---

## 3. elldeeone/kaspa-x402 — not re-audited

Parker already filed [elldeeone/kaspa-x402#13](https://github.com/elldeeone/kaspa-x402/issues/13) with funded TN10 evidence. This pass did **not** clone that repo, did **not** re-run its 710 tests, and did **not** re-broadcast. Doing that again would be a second audit of the rail, not of kascade.

kascade still settles through that rail. The rail review stands. The kascade-specific gap stands: `prove-live-meridian.ts` still uses unpaid `fetchFile` then a souvenir voucher. There is now also `tools/prove-live-paid.ts`, which *does* use `gatherPaid`. The README still leads with the unpaid meridian proof. That is progress in the tree, not in the advertised proof.

---

## 4. Claude artifacts — still not evidence

https://claude.ai/code/artifact/8de4170e-f975-4c40-9b96-f28d7e62d4e8  
Still a login wall: “Content is user-generated and unverified.” Not used.

---

## 5. Offered TN10 Kasware wallet — not used

The follow-up offered a funded TN10 wallet in Kasware:

`chrome-extension://hklhheigdmpoolooomdihmhlpjjdbklf/index.html#WalletTabScreen`

That is a **Chrome extension page**. This environment cannot drive it. I will not read Kasware’s extension storage for a seed or private key.

To use that wallet for a live proof, the operator would send tKAS to a kascade-generated `~/.kascade/gatherer` address, then run `prove-live-paid.ts`. That step was not done here.

---

## 6. Follow-up test artifact — added

See [follow-up/](follow-up/).

- **Fails today against upstream:** incomplete `fetchFile` returns zeros (`npm run test:upstream`).
- **Passes here:** incomplete assemble returns real parcels; publisher-pays; three disjoint honest founts; liar unpaid; claims below 2,600,000 sompi held (`npm test`).

That is the “next artifact” the original review named. It is a spec-with-tests, not a merge into kascade.
