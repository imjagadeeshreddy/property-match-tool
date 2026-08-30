import Link from 'next/link';
import { desc } from 'drizzle-orm';

import { EmptyState } from '@/components/EmptyState';
import { FilterTabs } from '@/components/FilterTabs';
import { PageHeader } from '@/components/PageHeader';
import { PlotCard } from '@/components/PlotCard';
import { db } from '@/db';
import { buyers, plots, type Plot } from '@/db/schema';
import { countMatchesPerPlot } from '@/lib/matching';

export const dynamic = 'force-dynamic';

/**
 * Two tabs, three statuses. A plot being negotiated is still on the market,
 * so it lives under "Available" with a "Talking" badge - it just stops being
 * offered to other buyers. Keeps the screen simple without losing the state.
 */
const TABS = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

function inTab(plot: Plot, tab: TabValue): boolean {
  return tab === 'sold' ? plot.status === 'sold' : plot.status !== 'sold';
}

export default async function PlotsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const active: TabValue = searchParams.status === 'sold' ? 'sold' : 'available';

  const [allPlots, allBuyers] = await Promise.all([
    db.select().from(plots).orderBy(desc(plots.updatedAt)),
    db.select().from(buyers),
  ]);

  const matchCounts = countMatchesPerPlot(allPlots, allBuyers);
  const visible = allPlots.filter((plot) => inTab(plot, active));

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
          tabs={TABS.map((tab) => ({
            value: tab.value,
            label: tab.label,
            count: allPlots.filter((plot) => inTab(plot, tab.value)).length,
          }))}
        />

        {visible.length === 0 ? (
          <EmptyState
            title={active === 'sold' ? 'No plots sold yet' : 'No plots yet'}
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
