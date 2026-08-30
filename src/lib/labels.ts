import type { BuyerStatus, PlotStatus } from '@/db/schema';

export const PLOT_STATUS_LABEL: Record<PlotStatus, string> = {
  available: 'Available',
  under_negotiation: 'Talking',
  sold: 'Sold',
};

export const BUYER_STATUS_LABEL: Record<BuyerStatus, string> = {
  new: 'New',
  active: 'Active',
  closed: 'Closed',
  lost: 'Lost',
};

/** Tailwind classes for the little status pills. */
export const PLOT_STATUS_STYLE: Record<PlotStatus, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  under_negotiation: 'bg-amber-100 text-amber-800',
  sold: 'bg-slate-200 text-slate-600',
};

export const BUYER_STATUS_STYLE: Record<BuyerStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  active: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-600',
  lost: 'bg-rose-100 text-rose-700',
};
