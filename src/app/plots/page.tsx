import Link from 'next/link';
import { desc } from 'drizzle-orm';

import { EmptyState } from '@/components/EmptyState';
import { FilterTabs } from '@/components/FilterTabs';
import { PageHeader } from '@/components/PageHeader';
import { PlotCard } from '@/components/PlotCard';
import { db } from '@/db';
import { PLOT_STATUSES, buyers, plots, type PlotStatus } from '@/db/schema';
import { countMatchesPerPlot } from '@/lib/matching';

export const dynamic = 'force-dynamic';

const TAB_LABEL: Record<PlotStatus, string> = {
  available: 'Available',
  under_negotiation: 'Talking',
  sold: 'Sold',
};

export default async function PlotsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const active: PlotStatus = (PLOT_STATUSES as readonly string[]).includes(
    searchParams.status ?? '',
  )
    ? (searchParams.status as PlotStatus)
    : 'available';

  const [allPlots, allBuyers] = await Promise.all([
    db.select().from(plots).orderBy(desc(plots.updatedAt)),
    db.select().from(buyers),
  ]);

  const matchCounts = countMatchesPerPlot(allPlots, allBuyers);
  const visible = allPlots.filter((plot) => plot.status === active);

  return (
    <>
      <PageHeader
        title="Plots"
        action={
          <Link href="/plots/new" className="btn-primary px-4" aria-label="Add plot">
            + Add
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        <FilterTabs
          basePath="/plots"
          active={active}
          tabs={PLOT_STATUSES.map((status) => ({
            value: status,
            label: TAB_LABEL[status],
            count: allPlots.filter((plot) => plot.status === status).length,
          }))}
        />

        {visible.length === 0 ? (
          <EmptyState
            title={`No ${TAB_LABEL[active].toLowerCase()} plots yet`}
            hint={active === 'available' ? 'Add a plot to start matching buyers.' : undefined}
            actionLabel={active === 'available' ? 'Add a plot' : undefined}
            actionHref={active === 'available' ? '/plots/new' : undefined}
          />
        ) : (
          <div className="space-y-3">
            {visible.map((plot) => (
              <PlotCard key={plot.id} plot={plot} matchCount={matchCounts.get(plot.id) ?? 0} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
