'use client';

import { useFormStatus } from 'react-dom';

/** Submit button that disables itself while the action runs — no double taps. */
export function SubmitButton({
  children,
  pendingLabel,
  className = 'btn-primary w-full',
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? (pendingLabel ?? 'Saving…') : children}
    </button>
  );
}
