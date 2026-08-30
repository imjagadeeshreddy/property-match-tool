import Link from 'next/link';

import type { Plot } from '@/db/schema';
import { formatMoney, formatSize } from '@/lib/format';

import { PlotStatusPill } from './StatusPill';

export function PlotCard({ plot, matchCount }: { plot: Plot; matchCount: number }) {
  return (
    <Link href={`/plots/${plot.id}`} className="card active:bg-slate-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">{plot.location}</p>
          <p className="text-slate-500">{formatSize(plot.sizeValue, plot.sizeUnit)}</p>
        </div>
        <PlotStatusPill status={plot.status} />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold text-slate-900">{formatMoney(plot.askingPrice)}</p>
        {plot.status === 'available' && (
          <span
            className={`text-base font-semibold ${
              matchCount > 0 ? 'text-brand-500' : 'text-slate-400'
            }`}
          >
            {matchCount === 1 ? '1 matching buyer' : `${matchCount} matching buyers`}
          </span>
        )}
        {plot.status === 'under_negotiation' && (
          <span className="text-base font-semibold text-amber-700">Not being offered</span>
        )}
      </div>

      <p className="mt-2 truncate text-slate-500">
        {plot.ownerName} · {plot.ownerPhone}
      </p>
    </Link>
  );
}
