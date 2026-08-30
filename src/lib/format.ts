/** Formatting helpers, tuned for an Indian land broker reading on a phone. */

const CRORE = 10_000_000;
const LAKH = 100_000;

/** 4500000 -> "45 L", 25000000 -> "2.5 Cr" — short enough to fit a phone row. */
export function formatMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '—';
  if (amount >= CRORE) return `₹${trim(amount / CRORE)} Cr`;
  if (amount >= LAKH) return `₹${trim(amount / LAKH)} L`;
  if (amount >= 1000) return `₹${trim(amount / 1000)} K`;
  return `₹${trim(amount)}`;
}

export function formatBudget(min: number, max: number): string {
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

export function formatSize(value: number, unit: string): string {
  return `${trim(value)} ${unit}`;
}

function trim(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString('en-IN');
}

/** "12 Mar 2026" — unambiguous, no locale guessing. */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Never';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function daysSince(date: Date | null | undefined): number | null {
  if (!date) return null;
  const ms = Date.now() - date.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** "Today", "Yesterday", "5 days ago", "Never contacted" */
export function formatLastContacted(date: Date | null | undefined): string {
  const days = daysSince(date);
  if (days === null) return 'Never contacted';
  if (days <= 0) return 'Contacted today';
  if (days === 1) return 'Contacted yesterday';
  return `Contacted ${days} days ago`;
}
