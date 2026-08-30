'use client';

import { useState } from 'react';

/** Big tappable radio pills — no fiddly native <select> on a phone. */
export function ChoiceGroup({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
}) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <fieldset>
      <legend className="field-label">{label}</legend>
      <input type="hidden" name={name} value={selected} />
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              aria-pressed={active}
              className={`min-h-[3rem] rounded-xl px-4 text-base font-semibold transition active:scale-[0.98] ${
                active
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'border border-slate-300 bg-white text-slate-700'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
