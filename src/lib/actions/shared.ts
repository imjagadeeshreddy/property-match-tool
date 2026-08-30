export type FormState = { error: string | null };

export const OK: FormState = { error: null };

export function fail(message: string): FormState {
  return { error: message };
}

/** Trimmed string, or null when the field was left blank. */
export function optionalText(data: FormData, key: string): string | null {
  const value = data.get(key);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requiredText(data: FormData, key: string): string {
  return optionalText(data, key) ?? '';
}

/**
 * Reads a number, ignoring anything that is not a digit or a dot — so
 * "45,00,000", "₹45 00 000" and "45" all work. Returns null when blank
 * or unparseable.
 */
export function optionalNumber(data: FormData, key: string): number | null {
  const raw = optionalText(data, key);
  if (raw === null) return null;
  const cleaned = raw.replace(/[^0-9.]/g, '');
  if (cleaned === '') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Money fields are typed in lakhs on the form; stored as rupees. */
export const LAKH = 100_000;

export function optionalLakhs(data: FormData, key: string): number | null {
  const value = optionalNumber(data, key);
  return value === null ? null : Math.round(value * LAKH);
}
