import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ActionButton } from '@/components/ActionButton';
import { BuyerCard } from '@/components/BuyerCard';
import { CallLink } from '@/components/CallLink';
import { PageHeader } from '@/components/PageHeader';
import { PlotStatusPill } from '@/components/StatusPill';
import { db } from '@/db';
import { buyers, plots, type PlotStatus } from '@/db/schema';
import { setPlotStatus } from '@/lib/actions/plots';
import { formatMoney, formatSize } from '@/lib/format';
import { countMatchesPerBuyer, findMatchingBuyers } from '@/lib/matching';

export const dynamic = 'force-dynamic';

/** Which one-tap moves make sense from where the plot is right now. */
const NEXT_STEPS: Record<PlotStatus, { status: PlotStatus; label: string; style: string }[]> = {
  available: [
    { status: 'under_negotiation', label: 'Talking to a buyer', style: 'btn-secondary w-full' },
    { status: 'sold', label: 'Mark as sold', style: 'btn-success w-full' },
  ],
  under_negotiation: [
    { status: 'sold', label: 'Mark as sold', style: 'btn-success w-full' },
    { status: 'available', label: 'Back to available', style: 'btn-secondary w-full' },
  ],
  sold: [{ status: 'available', label: 'Make available again', style: 'btn-secondary w-full' }],
};

export default async function PlotDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const [plot] = await db.select().from(plots).where(eq(plots.id, id));
  if (!plot) notFound();

  const [allBuyers, allPlots] = await Promise.all([
    db.select().from(buyers),
    db.select().from(plots),
  ]);

  const matches = findMatchingBuyers(plot, allBuyers);
  const buyerMatchCounts = countMatchesPerBuyer(matches, allPlots);

  return (
    <>
      <PageHeader
        title={plot.location}
        subtitle={formatSize(plot.sizeValue, plot.sizeUnit)}
        backHref="/plots"
        action={
          <Link href={`/plots/${plot.id}/edit`} className="btn-secondary px-4">
            Edit
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        <section className="card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Asking price
              </p>
              <p className="text-3xl font-bold text-slate-900">{formatMoney(plot.askingPrice)}</p>
            </div>
            <PlotStatusPill status={plot.status} />
          </div>

          <hr className="my-4 border-slate-100" />

          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Owner</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{plot.ownerName}</p>
          <CallLink phone={plot.ownerPhone} className="mt-3" />
        </section>

        {plot.notes && (
          <section className="card">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-slate-700">{plot.notes}</p>
          </section>
        )}

        <section className="space-y-2">
          {NEXT_STEPS[plot.status].map((step) => (
            <ActionButton
              key={step.status}
              action={setPlotStatus.bind(null, plot.id, step.status)}
              className={step.style}
            >
              {step.label}
            </ActionButton>
          ))}
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            {matches.length === 1 ? '1 matching buyer' : `${matches.length} matching buyers`}
          </h2>

          {plot.status !== 'available' ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center text-slate-500">
              Matching is only shown for available plots.
            </p>
          ) : matches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center text-slate-500">
              No buyer wants this area at this price yet.
            </p>
          ) : (
            <div className="space-y-3">
              {matches.map((buyer) => (
                <BuyerCard
                  key={buyer.id}
                  buyer={buyer}
                  matchCount={buyerMatchCounts.get(buyer.id) ?? 0}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
