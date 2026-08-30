import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { BuyerForm } from '@/components/BuyerForm';
import { PageHeader } from '@/components/PageHeader';
import { db } from '@/db';
import { buyers } from '@/db/schema';
import { updateBuyer } from '@/lib/actions/buyers';

export const dynamic = 'force-dynamic';

export default async function EditBuyerPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id));
  if (!buyer) notFound();

  return (
    <>
      <PageHeader title="Edit buyer" subtitle={buyer.name} backHref={`/buyers/${buyer.id}`} />
      <BuyerForm action={updateBuyer.bind(null, buyer.id)} buyer={buyer} submitLabel="Save changes" />
    </>
  );
}
