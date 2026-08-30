import type { BuyerStatus, PlotStatus } from '@/db/schema';
import {
  BUYER_STATUS_LABEL,
  BUYER_STATUS_STYLE,
  PLOT_STATUS_LABEL,
  PLOT_STATUS_STYLE,
} from '@/lib/labels';

export function PlotStatusPill({ status }: { status: PlotStatus }) {
  return <span className={`pill ${PLOT_STATUS_STYLE[status]}`}>{PLOT_STATUS_LABEL[status]}</span>;
}

export function BuyerStatusPill({ status }: { status: BuyerStatus }) {
  return <span className={`pill ${BUYER_STATUS_STYLE[status]}`}>{BUYER_STATUS_LABEL[status]}</span>;
}
