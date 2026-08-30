import type { Buyer, Plot } from '@/db/schema';

/**
 * Rule-based matching. Deliberately loose: it is better to show one extra
 * plot than to hide a deal because a village name was spelled differently.
 *
 * A plot matches a buyer when BOTH hold:
 *   1. plot.askingPrice is inside [buyer.budgetMin, buyer.budgetMax]
 *   2. plot.location loosely matches buyer.areaPreference
 *
 * Only "available" plots are matched, and only against "new"/"active" buyers.
 */

export function isMatchablePlot(plot: Pick<Plot, 'status'>): boolean {
  return plot.status === 'available';
}

export function isMatchableBuyer(buyer: Pick<Buyer, 'status'>): boolean {
  return buyer.status === 'new' || buyer.status === 'active';
}

export function priceMatches(
  plot: Pick<Plot, 'askingPrice'>,
  buyer: Pick<Buyer, 'budgetMin' | 'budgetMax'>,
): boolean {
  return plot.askingPrice >= buyer.budgetMin && plot.askingPrice <= buyer.budgetMax;
}

/**
 * Case-insensitive substring match, checked in both directions so that
 * "Shankarpally" matches a preference of "Shankarpally village" and a
 * location of "Near Shankarpally" alike. A buyer may list several areas
 * separated by commas, slashes, or "or".
 */
export function locationMatches(
  plot: Pick<Plot, 'location'>,
  buyer: Pick<Buyer, 'areaPreference'>,
): boolean {
  const location = normalise(plot.location);
  if (!location) return false;

  const wanted = splitAreas(buyer.areaPreference);
  if (wanted.length === 0) return false;

  return wanted.some((area) => location.includes(area) || area.includes(location));
}

export function plotMatchesBuyer(plot: Plot, buyer: Buyer): boolean {
  return (
    isMatchablePlot(plot) &&
    isMatchableBuyer(buyer) &&
    priceMatches(plot, buyer) &&
    locationMatches(plot, buyer)
  );
}

/** Buyers (new/active) whose budget and area fit this plot. */
export function findMatchingBuyers(plot: Plot, buyers: Buyer[]): Buyer[] {
  if (!isMatchablePlot(plot)) return [];
  return buyers.filter((buyer) => plotMatchesBuyer(plot, buyer));
}

/** Available plots that fit this buyer's budget and area. */
export function findMatchingPlots(buyer: Buyer, plots: Plot[]): Plot[] {
  if (!isMatchableBuyer(buyer)) return [];
  return plots.filter((plot) => plotMatchesBuyer(plot, buyer));
}

/** Match counts keyed by plot id — one pass, for list screens. */
export function countMatchesPerPlot(plots: Plot[], buyers: Buyer[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const plot of plots) {
    counts.set(plot.id, findMatchingBuyers(plot, buyers).length);
  }
  return counts;
}

/** Match counts keyed by buyer id — one pass, for list screens. */
export function countMatchesPerBuyer(buyers: Buyer[], plots: Plot[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const buyer of buyers) {
    counts.set(buyer.id, findMatchingPlots(buyer, plots).length);
  }
  return counts;
}

function splitAreas(raw: string): string[] {
  return raw
    .split(/[,/]|\bor\b/i)
    .map(normalise)
    .filter(Boolean);
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
