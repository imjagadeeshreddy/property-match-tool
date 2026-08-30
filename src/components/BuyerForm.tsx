'use client';

import { useFormState } from 'react-dom';

import { ChoiceGroup } from '@/components/form/ChoiceGroup';
import { Field, FormError } from '@/components/form/Field';
import { MoneyField } from '@/components/form/MoneyField';
import { SubmitButton } from '@/components/SubmitButton';
import { BUYER_STATUSES, type Buyer } from '@/db/schema';
import type { FormState } from '@/lib/actions/shared';
import { BUYER_STATUS_LABEL } from '@/lib/labels';

const INITIAL: FormState = { error: null };

export function BuyerForm({
  action,
  buyer,
  submitLabel,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  buyer?: Buyer;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, INITIAL);

  return (
    <form action={formAction} className="space-y-5 p-4">
      <FormError message={state.error} />

      <Field label="Buyer name" htmlFor="name">
        <input
          id="name"
          name="name"
          defaultValue={buyer?.name}
          placeholder="e.g. Suresh Kumar"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <Field label="Phone" htmlFor="phone">
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={buyer?.phone}
          placeholder="e.g. 98480 12345"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <MoneyField name="budgetMin" label="Budget from" defaultRupees={buyer?.budgetMin} />
        <MoneyField name="budgetMax" label="Up to" defaultRupees={buyer?.budgetMax} />
      </div>

      <Field
        label="Area they want"
        htmlFor="areaPreference"
        hint="More than one area? Separate with commas."
      >
        <input
          id="areaPreference"
          name="areaPreference"
          defaultValue={buyer?.areaPreference}
          placeholder="e.g. Shankarpally, Chevella"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <Field label="Size they want" htmlFor="sizePreference" optional>
        <input
          id="sizePreference"
          name="sizePreference"
          defaultValue={buyer?.sizePreference ?? ''}
          placeholder="e.g. 1–2 acres"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <ChoiceGroup
        name="status"
        label="Status"
        defaultValue={buyer?.status ?? 'new'}
        options={BUYER_STATUSES.map((status) => ({
          value: status,
          label: BUYER_STATUS_LABEL[status],
        }))}
      />

      <Field label="Notes" htmlFor="notes" optional>
        <textarea
          id="notes"
          name="notes"
          defaultValue={buyer?.notes ?? ''}
          rows={3}
          placeholder="Who referred them, how soon they want to buy, anything to remember"
          className="field-input"
        />
      </Field>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
