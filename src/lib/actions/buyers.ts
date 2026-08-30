'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from '@/db';
import { BUYER_STATUSES, buyers, type BuyerStatus } from '@/db/schema';

import {
  fail,
  optionalLakhs,
  optionalText,
  requiredText,
  type FormState,
} from './shared';

function readBuyerForm(data: FormData) {
  const name = requiredText(data, 'name');
  const phone = requiredText(data, 'phone');
  const areaPreference = requiredText(data, 'areaPreference');
  const budgetMin = optionalLakhs(data, 'budgetMin');
  const budgetMax = optionalLakhs(data, 'budgetMax');
  const statusRaw = optionalText(data, 'status');
  const status = (BUYER_STATUSES as readonly string[]).includes(statusRaw ?? '')
    ? (statusRaw as BuyerStatus)
    : 'active';

  if (!name) return { error: "Please enter the buyer's name." } as const;
  if (!phone) return { error: 'Please enter a phone number.' } as const;
  if (budgetMin === null || budgetMin <= 0) return { error: 'Please enter the budget from.' } as const;
  if (budgetMax === null || budgetMax <= 0) return { error: 'Please enter the budget up to.' } as const;
  if (budgetMax < budgetMin) {
    return { error: '"Up to" should be more than "From". Please check the budget.' } as const;
  }
  if (!areaPreference) return { error: 'Please enter the area they want.' } as const;

  return {
    error: null,
    values: {
      name,
      phone,
      budgetMin,
      budgetMax,
      areaPreference,
      sizePreference: optionalText(data, 'sizePreference'),
      status,
      notes: optionalText(data, 'notes'),
    },
  } as const;
}

export async function createBuyer(_prev: FormState, data: FormData): Promise<FormState> {
  const parsed = readBuyerForm(data);
  if (parsed.error) return fail(parsed.error);

  const now = new Date();
  const [created] = await db
    .insert(buyers)
    .values({ ...parsed.values, lastContactedAt: now, createdAt: now, updatedAt: now })
    .returning({ id: buyers.id });

  revalidatePath('/buyers');
  revalidatePath('/');
  redirect(`/buyers/${created.id}`);
}

export async function updateBuyer(
  id: number,
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const parsed = readBuyerForm(data);
  if (parsed.error) return fail(parsed.error);

  await db
    .update(buyers)
    .set({ ...parsed.values, updatedAt: new Date() })
    .where(eq(buyers.id, id));

  revalidatePath('/buyers');
  revalidatePath(`/buyers/${id}`);
  revalidatePath('/');
  redirect(`/buyers/${id}`);
}

/** One-tap status change from a list row or the detail screen. */
export async function setBuyerStatus(id: number, status: BuyerStatus): Promise<void> {
  await db.update(buyers).set({ status, updatedAt: new Date() }).where(eq(buyers.id, id));

  revalidatePath('/buyers');
  revalidatePath(`/buyers/${id}`);
  revalidatePath('/');
}

/** "Called today" — the single most-used action on the Today screen. */
export async function markContactedToday(id: number): Promise<void> {
  await db
    .update(buyers)
    .set({ lastContactedAt: new Date(), updatedAt: new Date() })
    .where(eq(buyers.id, id));

  revalidatePath('/buyers');
  revalidatePath(`/buyers/${id}`);
  revalidatePath('/');
}
