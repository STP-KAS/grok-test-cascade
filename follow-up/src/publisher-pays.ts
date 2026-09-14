/**
 * Publisher-pays settlement the live kascade market copy describes and the code does not ship.
 *
 * Viewer verifies parcels and signs receipts. Publisher's budget is what gets spent.
 * A fount with faults and no verified parcels is unpaid. Claims below dust are held, not paid.
 */
export const DUST_SOMPI = 2_600_000;

export interface FountTally {
  parcels: number;
  bytes: number;
  sompi: number;
}

export interface PublisherSettlement {
  pay: { url: string; sompi: number }[];
  unpaidLiar: string[];
  belowDust: { url: string; sompi: number }[];
  overBudget: { url: string; sompi: number }[];
  remaining: number;
  viewerPaidSompi: 0;
}

export function settlePublisherPays(opts: {
  budgetSompi: number;
  perFount: Record<string, FountTally>;
  faults: { url: string }[];
  dustSompi?: number;
}): PublisherSettlement {
  const dust = opts.dustSompi ?? DUST_SOMPI;
  const faulted = new Set(opts.faults.map((f) => f.url));
  const pay: PublisherSettlement["pay"] = [];
  const unpaidLiar: string[] = [];
  const belowDust: PublisherSettlement["belowDust"] = [];
  const overBudget: PublisherSettlement["overBudget"] = [];
  let remaining = opts.budgetSompi;

  const urls = [...new Set([...Object.keys(opts.perFount), ...faulted])];
  for (const url of urls) {
    const tally = opts.perFount[url];
    const earned = tally?.sompi ?? 0;
    if (earned <= 0) {
      if (faulted.has(url)) unpaidLiar.push(url);
      continue;
    }
    if (earned < dust) {
      belowDust.push({ url, sompi: earned });
      continue;
    }
    if (earned > remaining) {
      overBudget.push({ url, sompi: earned });
      continue;
    }
    pay.push({ url, sompi: earned });
    remaining -= earned;
  }

  return { pay, unpaidLiar, belowDust, overBudget, remaining, viewerPaidSompi: 0 };
}
