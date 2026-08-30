'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from '@/db';
import { PLOT_STATUSES, plots, type PlotStatus } from '@/db/schema';

import {
  fail,
  optionalLakhs,
  optionalNumber,
  optionalText,
  requiredText,
  type FormState,
} from './shared';

function readPlotForm(data: FormData) {
  const location = requiredText(data, 'location');
  const ownerName = requiredText(data, 'ownerName');
  const ownerPhone = requiredText(data, 'ownerPhone');
  const sizeValue = optionalNumber(data, 'sizeValue');
  const askingPrice = optionalLakhs(data, 'askingPrice');
  const sizeUnit = optionalText(data, 'sizeUnit') ?? 'acres';
  const statusRaw = optionalText(data, 'status');
  const status = (PLOT_STATUSES as readonly string[]).includes(statusRaw ?? '')
    ? (statusRaw as PlotStatus)
    : 'available';

  if (!location) return { error: 'Please enter the place / village.' } as const;
  if (sizeValue === null || sizeValue <= 0) return { error: 'Please enter the plot size.' } as const;
  if (askingPrice === null || askingPrice <= 0) {
    return { error: 'Please enter the asking price.' } as const;
  }
  if (!ownerName) return { error: "Please enter the owner's name." } as const;
  if (!ownerPhone) return { error: "Please enter the owner's phone number." } as const;

  return {
    error: null,
    values: {
      location,
      sizeValue,
      sizeUnit,
      askingPrice,
      ownerName,
      ownerPhone,
      status,
      notes: optionalText(data, 'notes'),
    },
  } as const;
}

/** "Sold this month" reads soldAt, so keep it in step with the status. */
function soldAtFor(status: PlotStatus, previous: Date | null | undefined): Date | null {
  if (status !== 'sold') return null;
  return previous ?? new Date();
}

export async function createPlot(_prev: FormState, data: FormData): Promise<FormState> {
  const parsed = readPlotForm(data);
  if (parsed.error) return fail(parsed.error);

  const now = new Date();
  const [created] = await db
    .insert(plots)
    .values({
      ...parsed.values,
      soldAt: soldAtFor(parsed.values.status, null),
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: plots.id });

  revalidatePath('/plots');
  revalidatePath('/');
  redirect(`/plots/${created.id}`);
}

export async function updatePlot(
  id: number,
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const parsed = readPlotForm(data);
  if (parsed.error) return fail(parsed.error);

  const [existing] = await db.select().from(plots).where(eq(plots.id, id));
  if (!existing) return fail('That plot no longer exists.');

  await db
    .update(plots)
    .set({
      ...parsed.values,
      soldAt: soldAtFor(parsed.values.status, existing.soldAt),
      updatedAt: new Date(),
    })
    .where(eq(plots.id, id));

  revalidatePath('/plots');
  revalidatePath(`/plots/${id}`);
  revalidatePath('/');
  redirect(`/plots/${id}`);
}

/** One-tap status change from a list row or the detail screen. */
export async function setPlotStatus(id: number, status: PlotStatus): Promise<void> {
  const [existing] = await db.select().from(plots).where(eq(plots.id, id));
  if (!existing) return;

  await db
    .update(plots)
    .set({ status, soldAt: soldAtFor(status, existing.soldAt), updatedAt: new Date() })
    .where(eq(plots.id, id));

  revalidatePath('/plots');
  revalidatePath(`/plots/${id}`);
  revalidatePath('/');
}
