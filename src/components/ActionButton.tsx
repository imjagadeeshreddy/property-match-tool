import { SubmitButton } from './SubmitButton';

/**
 * A single-tap action (mark sold, called today, …). Renders as a tiny form so
 * the server action runs without any client-side data fetching.
 */
export function ActionButton({
  action,
  children,
  className = 'btn-secondary w-full',
  pendingLabel,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  return (
    <form action={action} className="contents">
      <SubmitButton className={className} pendingLabel={pendingLabel}>
        {children}
      </SubmitButton>
    </form>
  );
}
