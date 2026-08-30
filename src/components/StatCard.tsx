import Link from 'next/link';

export function StatCard({
  value,
  label,
  href,
}: {
  value: number;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium leading-tight text-slate-500">{label}</p>
    </>
  );

  const className =
    'flex flex-col justify-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm';

  return href ? (
    <Link href={href} className={`${className} active:bg-slate-50`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
