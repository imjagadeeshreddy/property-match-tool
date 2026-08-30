import Link from 'next/link';
import { desc } from 'drizzle-orm';

import { BuyerCard } from '@/components/BuyerCard';
import { EmptyState } from '@/components/EmptyState';
import { FilterTabs } from '@/components/FilterTabs';
import { PageHeader } from '@/components/PageHeader';
import { db } from '@/db';
import { BUYER_STATUSES, buyers, plots, type BuyerStatus } from '@/db/schema';
import { BUYER_STATUS_LABEL } from '@/lib/labels';
import { countMatchesPerBuyer } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const active: BuyerStatus = (BUYER_STATUSES as readonly string[]).includes(
    searchParams.status ?? '',
  )
    ? (searchParams.status as BuyerStatus)
    : 'active';

  const [allBuyers, allPlots] = await Promise.all([
    db.select().from(buyers).orderBy(desc(buyers.updatedAt)),
    db.select().from(plots),
  ]);

  const matchCounts = countMatchesPerBuyer(allBuyers, allPlots);
  const visible = allBuyers.filter((buyer) => buyer.status === active);

  return (
    <>
      <PageHeader
        title="Buyers"
        action={
          <Link href="/buyers/new" className="btn-primary px-4" aria-label="Add buyer">
            + Add
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        <FilterTabs
          basePath="/buyers"
          active={active}
          tabs={BUYER_STATUSES.map((status) => ({
            value: status,
            label: BUYER_STATUS_LABEL[status],
            count: allBuyers.filter((buyer) => buyer.status === status).length,
          }))}
        />

        {visible.length === 0 ? (
          <EmptyState
            title={`No ${BUYER_STATUS_LABEL[active].toLowerCase()} buyers`}
            hint={active === 'active' ? 'Add a buyer when someone enquires.' : undefined}
            actionLabel={active === 'active' ? 'Add a buyer' : undefined}
            actionHref={active === 'active' ? '/buyers/new' : undefined}
          />
        ) : (
          <div className="space-y-3">
            {visible.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} matchCount={matchCounts.get(buyer.id) ?? 0} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
