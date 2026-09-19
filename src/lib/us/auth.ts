import 'server-only';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getDb, getEnv, requireSecret } from './env';
import { hashPassword, sha256Hex, timingSafeEqual, verifyPassword } from './crypto';
import { createSession, destroyAllSessions, getSessionUser, type SessionUser } from './session';
import { clearRateLimit, clientKey, rateLimit } from './rate-limit';

export const SIGN_IN_PATH = '/us/sign-in';

/**
 * Creates the two accounts from environment variables the first time they are
 * needed. Idempotent, and the only way a user row is ever created — there is
 * no signup route. Accounts start unclaimed (no password) until someone
 * proves they hold the setup token.
 */
export async function bootstrapUsers(): Promise<void> {
  const env = getEnv();
  const a = { name: env.PARTNER_A_NAME, email: env.PARTNER_A_EMAIL?.toLowerCase() };
  const b = { name: env.PARTNER_B_NAME, email: env.PARTNER_B_EMAIL?.toLowerCase() };
  if (!a.name || !a.email || !b.name || !b.email || a.email === b.email) {
    throw new Error(
      'PARTNER_A_NAME/EMAIL and PARTNER_B_NAME/EMAIL must be set to two different addresses.',
    );
  }

  const db = getDb();
  const existing = await db.prepare('SELECT COUNT(*) AS n FROM users').first<{ n: number }>();
  if ((existing?.n ?? 0) >= 2) return;

  const now = Date.now();

  await db.batch([
    db
      .prepare('INSERT OR IGNORE INTO users (id, email, name, created_at) VALUES (?1, ?2, ?3, ?4)')
      .bind(crypto.randomUUID(), a.email, a.name, now),
    db
      .prepare('INSERT OR IGNORE INTO users (id, email, name, created_at) VALUES (?1, ?2, ?3, ?4)')
      .bind(crypto.randomUUID(), b.email, b.name, now),
  ]);

  // Linked by email rather than by the ids above, so re-running after a
  // partial insert still repairs the pair.
  await db.batch([
    db
      .prepare(
        'UPDATE users SET partner_id = (SELECT id FROM users WHERE email = ?2) WHERE email = ?1',
      )
      .bind(a.email, b.email),
    db
      .prepare(
        'UPDATE users SET partner_id = (SELECT id FROM users WHERE email = ?2) WHERE email = ?1',
      )
      .bind(b.email, a.email),
  ]);
}

export type AuthResult = { ok: true } | { ok: false; message: string };

/** Deliberately identical for an unknown address and a wrong password. */
const GENERIC_SIGN_IN_ERROR = 'That email and password do not match.';

type StoredPassword = {
  password_hash: string | null;
  password_salt: string | null;
  password_algo: string | null;
  password_iterations: number | null;
};

function asRecord(row: StoredPassword | null | undefined) {
  return {
    password_hash: row?.password_hash ?? undefined,
    password_salt: row?.password_salt ?? undefined,
    password_algo: row?.password_algo ?? undefined,
    password_iterations: row?.password_iterations ?? undefined,
  };
}

export async function signIn(emailAddress: string, plainPassword: string): Promise<AuthResult> {
  const ipBucket = `signin:ip:${await clientKey()}`;
  const acctBucket = `signin:acct:${(await sha256Hex(emailAddress)).slice(0, 32)}`;

  const perIp = await rateLimit(ipBucket, 20, 15 * 60 * 1000);
  if (!perIp.ok) return { ok: false, message: 'Too many attempts. Try again in a few minutes.' };
  const perAccount = await rateLimit(acctBucket, 8, 15 * 60 * 1000);
  if (!perAccount.ok) {
    return { ok: false, message: 'Too many attempts. Try again in a few minutes.' };
  }

  const user = await getDb()
    .prepare(
      `SELECT id, password_hash, password_salt, password_algo, password_iterations
         FROM users WHERE email = ?1`,
    )
    .bind(emailAddress)
    .first<StoredPassword & { id: string }>();

  // verifyPassword burns equivalent CPU when the account is unknown, so the
  // response time does not disclose which addresses exist.
  const valid = await verifyPassword(plainPassword, asRecord(user));
  if (!user || !valid) return { ok: false, message: GENERIC_SIGN_IN_ERROR };

  await clearRateLimit(acctBucket);
  await clearRateLimit(ipBucket);
  await createSession(user.id, (await headers()).get('user-agent'));
  return { ok: true };
}

/**
 * One-time account claim. Requires the setup token held as a Cloudflare
 * secret, and refuses once the account already has a password.
 */
export async function claimAccount(
  emailAddress: string,
  setupToken: string,
  plainPassword: string,
): Promise<AuthResult> {
  const bucket = `claim:ip:${await clientKey()}`;
  const limited = await rateLimit(bucket, 10, 60 * 60 * 1000);
  if (!limited.ok) return { ok: false, message: 'Too many attempts. Try again later.' };

  const expected = requireSecret('SETUP_TOKEN');
  const tokenOk = timingSafeEqual(await sha256Hex(setupToken), await sha256Hex(expected));

  const user = await getDb()
    .prepare('SELECT id, claimed_at FROM users WHERE email = ?1')
    .bind(emailAddress)
    .first<{ id: string; claimed_at: number | null }>();

  if (!tokenOk || !user) return { ok: false, message: 'That setup link is not valid.' };
  if (user.claimed_at) {
    return { ok: false, message: 'This account already has a password. Sign in instead.' };
  }

  const record = await hashPassword(plainPassword);
  const result = await getDb()
    .prepare(
      `UPDATE users
          SET password_hash = ?2, password_salt = ?3, password_algo = ?4,
              password_iterations = ?5, claimed_at = ?6
        WHERE id = ?1 AND claimed_at IS NULL`,
    )
    .bind(
      user.id,
      record.password_hash,
      record.password_salt,
      record.password_algo,
      record.password_iterations,
      Date.now(),
    )
    .run();

  // The WHERE guard turns a concurrent double claim into a no-op, not a race.
  if (!result.meta.changes) {
    return { ok: false, message: 'This account already has a password. Sign in instead.' };
  }

  await clearRateLimit(bucket);
  await createSession(user.id, (await headers()).get('user-agent'));
  return { ok: true };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  nextPassword: string,
): Promise<AuthResult> {
  const bucket = `pwchange:${userId}`;
  const limited = await rateLimit(bucket, 5, 15 * 60 * 1000);
  if (!limited.ok) return { ok: false, message: 'Too many attempts. Try again later.' };

  const db = getDb();
  const user = await db
    .prepare(
      `SELECT password_hash, password_salt, password_algo, password_iterations
         FROM users WHERE id = ?1`,
    )
    .bind(userId)
    .first<StoredPassword>();

  if (!(await verifyPassword(currentPassword, asRecord(user)))) {
    return { ok: false, message: 'Your current password is not correct.' };
  }

  const record = await hashPassword(nextPassword);
  await db
    .prepare(
      `UPDATE users SET password_hash = ?2, password_salt = ?3, password_algo = ?4,
              password_iterations = ?5 WHERE id = ?1`,
    )
    .bind(
      userId,
      record.password_hash,
      record.password_salt,
      record.password_algo,
      record.password_iterations,
    )
    .run();

  // Every session on every device is invalidated, then this one is reissued.
  await destroyAllSessions(userId);
  await createSession(userId, (await headers()).get('user-agent'));
  await clearRateLimit(bucket);
  return { ok: true };
}

/**
 * The authorization boundary. Every protected page and every mutating action
 * calls this first. Middleware only does a cheap cookie-presence redirect and
 * is never relied on for access control.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(SIGN_IN_PATH);
  return user;
}

export async function requirePartner(user: SessionUser): Promise<SessionUser> {
  if (!user.partner_id) throw new Error('This account has no partner linked.');
  const partner = await getDb()
    .prepare('SELECT id, email, name, partner_id FROM users WHERE id = ?1')
    .bind(user.partner_id)
    .first<SessionUser>();
  if (!partner) throw new Error('Partner account is missing.');
  return partner;
}
