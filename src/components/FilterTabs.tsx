import Link from 'next/link';

export type FilterTab = { value: string; label: string; count: number };

/**
 * Horizontally scrolling filter chips. Uses plain links so the whole list
 * screen can stay a server component.
 */
export function FilterTabs({
  basePath,
  tabs,
  active,
}: {
  basePath: string;
  tabs: FilterTab[];
  active: string;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <Link
              key={tab.value}
              href={`${basePath}?status=${tab.value}`}
              scroll={false}
              className={`flex min-h-[2.75rem] items-center gap-2 rounded-full px-4 text-base font-semibold transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'border border-slate-300 bg-white text-slate-600'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-sm ${
                  isActive ? 'bg-white/25' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
