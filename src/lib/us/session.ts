import 'server-only';
import { cookies } from 'next/headers';
import { getDb } from './env';
import { randomToken, sha256Hex } from './crypto';

export const SESSION_COOKIE = 'us_session';
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
/** Slide the expiry at most once a day to avoid a write on every request. */
const REFRESH_AFTER_MS = 24 * 60 * 60 * 1000;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  partner_id: string | null;
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    // Local dev runs on http://localhost, where a Secure cookie is dropped.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/us',
    maxAge,
  };
}

export async function createSession(userId: string, userAgent: string | null): Promise<void> {
  const token = randomToken(32);
  const id = await sha256Hex(token);
  const now = Date.now();

  await getDb()
    .prepare(
      `INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at, user_agent)
       VALUES (?1, ?2, ?3, ?4, ?3, ?5)`,
    )
    .bind(id, userId, now, now + SESSION_TTL_MS, userAgent?.slice(0, 255) ?? null)
    .run();

  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_TTL_MS / 1000));
}

/**
 * Resolves the caller from the session cookie. Returns null for a missing,
 * unknown or expired token — never throws, so callers decide the response.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length !== 64) return null;

  const id = await sha256Hex(token);
  const now = Date.now();

  const row = await getDb()
    .prepare(
      `SELECT s.id AS sid, s.expires_at, s.last_seen_at,
              u.id, u.email, u.name, u.partner_id
         FROM sessions s
         JOIN users u ON u.id = s.user_id
        WHERE s.id = ?1 AND s.expires_at > ?2`,
    )
    .bind(id, now)
    .first<{
      sid: string;
      expires_at: number;
      last_seen_at: number;
      id: string;
      email: string;
      name: string;
      partner_id: string | null;
    }>();

  if (!row) return null;

  if (now - row.last_seen_at > REFRESH_AFTER_MS) {
    await getDb()
      .prepare('UPDATE sessions SET last_seen_at = ?2, expires_at = ?3 WHERE id = ?1')
      .bind(row.sid, now, now + SESSION_TTL_MS)
      .run();
  }

  return { id: row.id, email: row.email, name: row.name, partner_id: row.partner_id };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && token.length === 64) {
    await getDb().prepare('DELETE FROM sessions WHERE id = ?1').bind(await sha256Hex(token)).run();
  }
  jar.set(SESSION_COOKIE, '', cookieOptions(0));
}

/** Used after a password change: every other device is signed out. */
export async function destroyAllSessions(userId: string): Promise<void> {
  await getDb().prepare('DELETE FROM sessions WHERE user_id = ?1').bind(userId).run();
}
