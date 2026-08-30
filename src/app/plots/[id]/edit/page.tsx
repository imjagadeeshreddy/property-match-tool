import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/PageHeader';
import { PlotForm } from '@/components/PlotForm';
import { db } from '@/db';
import { plots } from '@/db/schema';
import { updatePlot } from '@/lib/actions/plots';

export const dynamic = 'force-dynamic';

export default async function EditPlotPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const [plot] = await db.select().from(plots).where(eq(plots.id, id));
  if (!plot) notFound();

  return (
    <>
      <PageHeader title="Edit plot" subtitle={plot.location} backHref={`/plots/${plot.id}`} />
      <PlotForm action={updatePlot.bind(null, plot.id)} plot={plot} submitLabel="Save changes" />
    </>
  );
}
