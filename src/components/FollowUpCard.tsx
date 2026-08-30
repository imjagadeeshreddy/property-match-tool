import Link from 'next/link';

import { ActionButton } from '@/components/ActionButton';
import type { Buyer } from '@/db/schema';
import { markContactedToday } from '@/lib/actions/buyers';
import { formatBudget, formatLastContacted } from '@/lib/format';

/**
 * A follow-up row is built for one thing: call, then tap "Called".
 * Both actions sit right next to each other, thumb-sized.
 */
export function FollowUpCard({ buyer, matchCount }: { buyer: Buyer; matchCount: number }) {
  const dialable = buyer.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="card">
      <Link href={`/buyers/${buyer.id}`} className="block">
        <p className="text-lg font-bold text-slate-900">{buyer.name}</p>
        <p className="truncate text-slate-500">
          Wants {buyer.areaPreference} · {formatBudget(buyer.budgetMin, buyer.budgetMax)}
        </p>
        <p className="mt-1 font-semibold text-amber-700">
          {formatLastContacted(buyer.lastContactedAt)}
        </p>
        {matchCount > 0 && (
          <p className="mt-1 font-semibold text-brand-500">
            {matchCount === 1 ? '1 plot to show them' : `${matchCount} plots to show them`}
          </p>
        )}
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={`tel:${dialable}`} className="btn-primary">
          Call
        </a>
        <ActionButton
          action={markContactedToday.bind(null, buyer.id)}
          className="btn-secondary w-full"
          pendingLabel="…"
        >
          Called
        </ActionButton>
      </div>
    </div>
  );
}
