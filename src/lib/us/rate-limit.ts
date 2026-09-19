import 'server-only';
import { getDb } from './env';
import { sha256Hex } from './crypto';
import { headers } from 'next/headers';

/**
 * Fixed-window limiter backed by D1. One row per attempt is cheap at this
 * scale (two users) and needs no extra binding or Durable Object.
 */
export type RateVerdict = { ok: boolean; retryAfterSeconds: number };

export async function rateLimit(
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<RateVerdict> {
  const db = getDb();
  const now = Date.now();
  const since = now - windowMs;

  await db.prepare('DELETE FROM rate_limits WHERE created_at < ?1').bind(now - 86_400_000).run();

  const row = await db
    .prepare(
      'SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM rate_limits WHERE bucket = ?1 AND created_at > ?2',
    )
    .bind(bucket, since)
    .first<{ n: number; oldest: number | null }>();

  const count = row?.n ?? 0;
  if (count >= limit) {
    const oldest = row?.oldest ?? now;
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }

  await db
    .prepare('INSERT INTO rate_limits (bucket, created_at) VALUES (?1, ?2)')
    .bind(bucket, now)
    .run();

  return { ok: true, retryAfterSeconds: 0 };
}

/** Clears a bucket after a success, so a good sign-in resets the counter. */
export async function clearRateLimit(bucket: string): Promise<void> {
  await getDb().prepare('DELETE FROM rate_limits WHERE bucket = ?1').bind(bucket).run();
}

/**
 * A stable, non-reversible per-client key. Cloudflare sets `cf-connecting-ip`
 * at the edge and it cannot be spoofed by the client, unlike x-forwarded-for.
 */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get('cf-connecting-ip') ?? 'unknown';
  return (await sha256Hex(`ip:${ip}`)).slice(0, 32);
}
