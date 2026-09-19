import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Everything the private app needs from the Cloudflare environment.
 *
 * Nothing here is ever imported by a client component — `server-only` makes
 * that a build error rather than a silent leak.
 */
export type UsEnv = {
  DB: D1Database;
  /** One-time token required to claim an account. Cloudflare secret. */
  SETUP_TOKEN?: string;
  PARTNER_A_NAME?: string;
  PARTNER_A_EMAIL?: string;
  PARTNER_B_NAME?: string;
  PARTNER_B_EMAIL?: string;
};

export function getEnv(): UsEnv {
  return getCloudflareContext().env as unknown as UsEnv;
}

export function getDb(): D1Database {
  const db = getEnv().DB;
  if (!db) {
    throw new Error(
      'D1 binding `DB` is missing. Check the d1_databases entry in wrangler.jsonc.',
    );
  }
  return db;
}

/** Throws rather than falling back, so a missing secret fails loudly. */
export function requireSecret(key: 'SETUP_TOKEN'): string {
  const value = getEnv()[key];
  if (!value || value.length < 16) {
    throw new Error(`Missing or too-short secret: ${key}`);
  }
  return value;
}
