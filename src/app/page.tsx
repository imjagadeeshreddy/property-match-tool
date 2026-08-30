import Link from 'next/link';

import { EmptyState } from '@/components/EmptyState';
import { FollowUpCard } from '@/components/FollowUpCard';
import { StatCard } from '@/components/StatCard';
import { db } from '@/db';
import { buyers, plots } from '@/db/schema';
import { FOLLOW_UP_AFTER_DAYS, getFollowUps } from '@/lib/followups';
import { countMatchesPerBuyer } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [allPlots, allBuyers] = await Promise.all([
    db.select().from(plots),
    db.select().from(buyers),
  ]);

  // Counts the same set the Plots "Available" tab shows: everything not sold.
  const availableCount = allPlots.filter((plot) => plot.status !== 'sold').length;
  const activeBuyerCount = allBuyers.filter((buyer) => buyer.status === 'active').length;
  const soldThisMonth = allPlots.filter(
    (plot) => plot.status === 'sold' && isThisMonth(plot.soldAt),
  ).length;

  const followUps = getFollowUps(allBuyers);
  const matchCounts = countMatchesPerBuyer(followUps, allPlots);

  return (
    <>
      <header className="bg-brand-500 px-4 pb-6 pt-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
        <h1 className="mt-1 text-3xl font-bold">Plot Match</h1>
      </header>

      <div className="space-y-6 p-4">
        <section className="-mt-10 grid grid-cols-3 gap-2">
          <StatCard value={availableCount} label="Plots available" href="/plots?status=available" />
          <StatCard value={activeBuyerCount} label="Buyers looking" href="/buyers?status=active" />
          <StatCard value={soldThisMonth} label="Sold this month" href="/plots?status=sold" />
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-slate-900">Follow up today</h2>
            {followUps.length > 0 && (
              <span className="font-semibold text-slate-500">{followUps.length} to call</span>
            )}
          </div>
          <p className="mb-3 text-slate-500">
            Buyers you have not spoken to in {FOLLOW_UP_AFTER_DAYS} days. Oldest first.
          </p>

          {followUps.length === 0 ? (
            <EmptyState
              title="Nobody to call today"
              hint={
                allBuyers.length === 0
                  ? 'Add a buyer and they will show up here when it is time to call.'
                  : 'Everyone has been contacted recently. Well done.'
              }
              actionLabel={allBuyers.length === 0 ? 'Add a buyer' : undefined}
              actionHref={allBuyers.length === 0 ? '/buyers/new' : undefined}
            />
          ) : (
            <div className="space-y-3">
              {followUps.map((buyer) => (
                <FollowUpCard
                  key={buyer.id}
                  buyer={buyer}
                  matchCount={matchCounts.get(buyer.id) ?? 0}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link href="/plots/new" className="btn-secondary">
            + Add plot
          </Link>
          <Link href="/buyers/new" className="btn-secondary">
            + Add buyer
          </Link>
        </section>
      </div>
    </>
  );
}

function isThisMonth(date: Date | null | undefined): boolean {
  if (!date) return false;
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
