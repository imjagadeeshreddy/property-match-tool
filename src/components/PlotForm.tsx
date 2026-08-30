'use client';

import { useFormState } from 'react-dom';

import { Field, FormError } from '@/components/form/Field';
import { ChoiceGroup } from '@/components/form/ChoiceGroup';
import { MoneyField } from '@/components/form/MoneyField';
import { SubmitButton } from '@/components/SubmitButton';
import { SIZE_UNITS, type Plot } from '@/db/schema';
import type { FormState } from '@/lib/actions/shared';
import { PLOT_STATUS_LABEL } from '@/lib/labels';

const INITIAL: FormState = { error: null };

export function PlotForm({
  action,
  plot,
  submitLabel,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  plot?: Plot;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, INITIAL);

  return (
    <form action={formAction} className="space-y-5 p-4">
      <FormError message={state.error} />

      <Field label="Place / village" htmlFor="location">
        <input
          id="location"
          name="location"
          defaultValue={plot?.location}
          placeholder="e.g. Shankarpally"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Size" htmlFor="sizeValue">
          <input
            id="sizeValue"
            name="sizeValue"
            defaultValue={plot?.sizeValue}
            inputMode="decimal"
            placeholder="e.g. 2"
            autoComplete="off"
            className="field-input"
          />
        </Field>
        <Field label="Unit" htmlFor="sizeUnit">
          <select
            id="sizeUnit"
            name="sizeUnit"
            defaultValue={plot?.sizeUnit ?? 'acres'}
            className="field-input"
          >
            {SIZE_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <MoneyField name="askingPrice" label="Asking price" defaultRupees={plot?.askingPrice} />

      <Field label="Owner name" htmlFor="ownerName">
        <input
          id="ownerName"
          name="ownerName"
          defaultValue={plot?.ownerName}
          placeholder="e.g. Ramesh Reddy"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <Field label="Owner phone" htmlFor="ownerPhone">
        <input
          id="ownerPhone"
          name="ownerPhone"
          type="tel"
          defaultValue={plot?.ownerPhone}
          placeholder="e.g. 98480 12345"
          autoComplete="off"
          className="field-input"
        />
      </Field>

      <ChoiceGroup
        name="status"
        label="Status"
        defaultValue={plot?.status ?? 'available'}
        options={[
          { value: 'available', label: PLOT_STATUS_LABEL.available },
          { value: 'under_negotiation', label: PLOT_STATUS_LABEL.under_negotiation },
          { value: 'sold', label: PLOT_STATUS_LABEL.sold },
        ]}
      />

      <Field label="Notes" htmlFor="notes" optional>
        <textarea
          id="notes"
          name="notes"
          defaultValue={plot?.notes ?? ''}
          rows={3}
          placeholder="Road access, water, papers, anything to remember"
          className="field-input"
        />
      </Field>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
