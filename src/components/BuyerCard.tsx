import Link from 'next/link';

import type { Buyer } from '@/db/schema';
import { formatBudget, formatLastContacted } from '@/lib/format';
import { isDueForFollowUp } from '@/lib/followups';

import { BuyerStatusPill } from './StatusPill';

export function BuyerCard({ buyer, matchCount }: { buyer: Buyer; matchCount: number }) {
  const due = isDueForFollowUp(buyer);
  const canMatch = buyer.status === 'active';

  return (
    <Link href={`/buyers/${buyer.id}`} className="card active:bg-slate-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">{buyer.name}</p>
          <p className="truncate text-slate-500">Wants {buyer.areaPreference}</p>
        </div>
        <BuyerStatusPill status={buyer.status} />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-xl font-bold text-slate-900">
          {formatBudget(buyer.budgetMin, buyer.budgetMax)}
        </p>
        {canMatch && (
          <span
            className={`shrink-0 text-base font-semibold ${
              matchCount > 0 ? 'text-brand-500' : 'text-slate-400'
            }`}
          >
            {matchCount === 1 ? '1 matching plot' : `${matchCount} matching plots`}
          </span>
        )}
      </div>

      <p className={`mt-2 text-base ${due ? 'font-semibold text-amber-700' : 'text-slate-500'}`}>
        {formatLastContacted(buyer.lastContactedAt)}
      </p>
    </Link>
  );
}
