import { BuyerForm } from '@/components/BuyerForm';
import { PageHeader } from '@/components/PageHeader';
import { createBuyer } from '@/lib/actions/buyers';

export default function NewBuyerPage() {
  return (
    <>
      <PageHeader title="Add buyer" backHref="/buyers" />
      <BuyerForm action={createBuyer} submitLabel="Save buyer" />
    </>
  );
}
