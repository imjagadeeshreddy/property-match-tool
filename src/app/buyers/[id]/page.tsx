import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ActionButton } from '@/components/ActionButton';
import { CallLink } from '@/components/CallLink';
import { PageHeader } from '@/components/PageHeader';
import { PlotCard } from '@/components/PlotCard';
import { BuyerStatusPill } from '@/components/StatusPill';
import { db } from '@/db';
import { buyers, plots, type BuyerStatus } from '@/db/schema';
import { markContactedToday, setBuyerStatus } from '@/lib/actions/buyers';
import { formatBudget, formatLastContacted } from '@/lib/format';
import { countMatchesPerPlot, findMatchingPlots } from '@/lib/matching';

export const dynamic = 'force-dynamic';

/** Which one-tap moves make sense from where the buyer is right now. */
const NEXT_STEPS: Record<BuyerStatus, { status: BuyerStatus; label: string; style: string }[]> = {
  new: [
    { status: 'active', label: 'Mark as active', style: 'btn-secondary w-full' },
    { status: 'lost', label: 'Not interested any more', style: 'btn-secondary w-full' },
  ],
  active: [
    { status: 'closed', label: 'Deal done', style: 'btn-success w-full' },
    { status: 'lost', label: 'Not interested any more', style: 'btn-secondary w-full' },
  ],
  closed: [{ status: 'active', label: 'Make active again', style: 'btn-secondary w-full' }],
  lost: [{ status: 'active', label: 'Make active again', style: 'btn-secondary w-full' }],
};

export default async function BuyerDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id));
  if (!buyer) notFound();

  const [allPlots, allBuyers] = await Promise.all([
    db.select().from(plots),
    db.select().from(buyers),
  ]);

  const matches = findMatchingPlots(buyer, allPlots);
  const plotMatchCounts = countMatchesPerPlot(matches, allBuyers);
  const isOpen = buyer.status === 'new' || buyer.status === 'active';

  return (
    <>
      <PageHeader
        title={buyer.name}
        subtitle={`Wants ${buyer.areaPreference}`}
        backHref="/buyers"
        action={
          <Link href={`/buyers/${buyer.id}/edit`} className="btn-secondary px-4">
            Edit
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        <section className="card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Budget</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatBudget(buyer.budgetMin, buyer.budgetMax)}
              </p>
            </div>
            <BuyerStatusPill status={buyer.status} />
          </div>

          {buyer.sizePreference && (
            <p className="mt-3 text-slate-600">
              <span className="font-semibold text-slate-700">Size wanted:</span>{' '}
              {buyer.sizePreference}
            </p>
          )}

          <hr className="my-4 border-slate-100" />

          <p className="text-base font-semibold text-slate-700">
            {formatLastContacted(buyer.lastContactedAt)}
          </p>
          <CallLink phone={buyer.phone} className="mt-3" />
        </section>

        {buyer.notes && (
          <section className="card">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-slate-700">{buyer.notes}</p>
          </section>
        )}

        <section className="space-y-2">
          {isOpen && (
            <ActionButton
              action={markContactedToday.bind(null, buyer.id)}
              className="btn-success w-full"
              pendingLabel="Saving…"
            >
              I called them today
            </ActionButton>
          )}
          {NEXT_STEPS[buyer.status].map((step) => (
            <ActionButton
              key={step.status}
              action={setBuyerStatus.bind(null, buyer.id, step.status)}
              className={step.style}
            >
              {step.label}
            </ActionButton>
          ))}
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            {matches.length === 1 ? '1 matching plot' : `${matches.length} matching plots`}
          </h2>

          {!isOpen ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center text-slate-500">
              Matching is only shown for new and active buyers.
            </p>
          ) : matches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center text-slate-500">
              No available plot fits this area and budget yet.
            </p>
          ) : (
            <div className="space-y-3">
              {matches.map((plot) => (
                <PlotCard key={plot.id} plot={plot} matchCount={plotMatchCounts.get(plot.id) ?? 0} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
