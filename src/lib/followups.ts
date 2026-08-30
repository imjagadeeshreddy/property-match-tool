import type { Buyer } from '@/db/schema';
import { daysSince } from './format';

/** A buyer is due for a follow-up after this many days of silence. */
export const FOLLOW_UP_AFTER_DAYS = 5;

export function isDueForFollowUp(buyer: Buyer): boolean {
  if (buyer.status !== 'new' && buyer.status !== 'active') return false;
  const days = daysSince(buyer.lastContactedAt);
  return days === null || days > FOLLOW_UP_AFTER_DAYS;
}

/** Buyers needing a call today, longest-silent first. Never-contacted go first. */
export function getFollowUps(buyers: Buyer[]): Buyer[] {
  return buyers.filter(isDueForFollowUp).sort((a, b) => {
    const aTime = a.lastContactedAt?.getTime() ?? 0;
    const bTime = b.lastContactedAt?.getTime() ?? 0;
    return aTime - bTime;
  });
}
