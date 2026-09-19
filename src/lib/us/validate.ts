import 'server-only';
import { MIN_PASSWORD_LENGTH } from './model';

/** Thrown by validators; server actions turn it into a field message. */
export class ValidationError extends Error {}

export function str(
  value: FormDataEntryValue | null | undefined,
  label: string,
  { min = 1, max = 2000, optional = false } = {},
): string {
  if (typeof value !== 'string') {
    if (optional) return '';
    throw new ValidationError(`${label} is required.`);
  }
  // Strip control characters; keep newlines and tabs.
  const clean = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!clean) {
    if (optional) return '';
    throw new ValidationError(`${label} is required.`);
  }
  if (clean.length < min) throw new ValidationError(`${label} must be at least ${min} characters.`);
  if (clean.length > max) throw new ValidationError(`${label} must be under ${max} characters.`);
  return clean;
}

export function oneOf<T extends readonly string[]>(
  value: FormDataEntryValue | null | undefined,
  allowed: T,
  label: string,
): T[number] {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!(allowed as readonly string[]).includes(v)) {
    throw new ValidationError(`${label} is not a valid choice.`);
  }
  return v as T[number];
}

export function int(
  value: FormDataEntryValue | null | undefined,
  label: string,
  { min = 0, max = 100 } = {},
): number {
  const n = Number(typeof value === 'string' ? value.trim() : NaN);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new ValidationError(`${label} must be a whole number.`);
  }
  if (n < min || n > max) throw new ValidationError(`${label} must be between ${min} and ${max}.`);
  return n;
}

/** 'YYYY-MM-DD', validated as a real calendar date. Empty string when optional. */
export function isoDate(
  value: FormDataEntryValue | null | undefined,
  label: string,
  { optional = true } = {},
): string {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!v) {
    if (optional) return '';
    throw new ValidationError(`${label} is required.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${label} must be a valid date.`);
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) {
    throw new ValidationError(`${label} must be a valid date.`);
  }
  return v;
}

/** 'YYYY-MM'. */
export function isoMonth(value: FormDataEntryValue | null | undefined, label: string): string {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(v)) throw new ValidationError(`${label} must be a month.`);
  return v;
}

export function id(value: FormDataEntryValue | null | undefined, label = 'Item'): string {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!/^[a-zA-Z0-9_-]{6,64}$/.test(v)) throw new ValidationError(`${label} could not be found.`);
  return v;
}

export function email(value: FormDataEntryValue | null | undefined): string {
  const v = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (v.length > 254 || !/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(v)) {
    throw new ValidationError('Enter a valid email address.');
  }
  return v;
}

/**
 * An existing password, read back verbatim for verification.
 *
 * Deliberately does not trim or strip control characters the way str() does:
 * password() below stores whatever was chosen, so anything that normalises
 * here but not there would lock the account out of a password it accepted.
 * Only the length is bounded.
 */
export function secret(value: FormDataEntryValue | null | undefined, label: string): string {
  const v = typeof value === 'string' ? value : '';
  if (!v) throw new ValidationError(`${label} is required.`);
  if (v.length > 200) throw new ValidationError(`${label} is too long.`);
  return v;
}

export function password(value: FormDataEntryValue | null | undefined): string {
  const v = typeof value === 'string' ? value : '';
  if (v.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  // Bounded so a huge body cannot turn PBKDF2 into a CPU amplifier.
  if (v.length > 200) throw new ValidationError('That password is too long.');
  return v;
}
