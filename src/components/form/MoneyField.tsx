'use client';

import { useState } from 'react';

import { formatMoney } from '@/lib/format';

/**
 * Money is typed in lakhs — "45", not "4500000" — because this is filled in
 * on a phone. The live preview underneath confirms what got understood.
 */
export function MoneyField({
  name,
  label,
  defaultRupees,
  placeholder = 'e.g. 45',
  optional,
}: {
  name: string;
  label: string;
  defaultRupees?: number | null;
  placeholder?: string;
  optional?: boolean;
}) {
  const initial =
    defaultRupees != null && defaultRupees > 0 ? String(round(defaultRupees / 100_000)) : '';
  const [value, setValue] = useState(initial);

  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  const preview =
    value.trim() !== '' && Number.isFinite(parsed) && parsed > 0
      ? formatMoney(parsed * 100_000)
      : null;

  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          className="field-input pr-20"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base font-semibold text-slate-400">
          lakhs
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium text-slate-500">
        {preview ? `= ${preview}` : 'Type in lakhs. 1 crore = 100 lakhs.'}
      </p>
    </div>
  );
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
