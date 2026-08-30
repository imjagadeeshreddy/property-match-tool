import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-xl font-bold text-slate-900">This page is not here</p>
      <p className="text-slate-500">It may have been removed, or the link was wrong.</p>
      <Link href="/" className="btn-primary">
        Go to home
      </Link>
    </div>
  );
}
