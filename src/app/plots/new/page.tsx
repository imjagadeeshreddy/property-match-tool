import { PageHeader } from '@/components/PageHeader';
import { PlotForm } from '@/components/PlotForm';
import { createPlot } from '@/lib/actions/plots';

export default function NewPlotPage() {
  return (
    <>
      <PageHeader title="Add plot" backHref="/plots" />
      <PlotForm action={createPlot} submitLabel="Save plot" />
    </>
  );
}
