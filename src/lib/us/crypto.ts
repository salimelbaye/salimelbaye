import 'server-only';

/**
 * Password hashing and token handling, built only on Web Crypto so it runs
 * unchanged on Cloudflare Workers.
 *
 * PBKDF2-HMAC-SHA256 is used because Workers has no native Argon2id or scrypt
 * without shipping WASM. The work factor is stored per user, so it can be
 * raised later and old hashes are transparently upgraded on next sign-in.
 *
 * Cloudflare's production Workers runtime rejects a single deriveBits call
 * above 100,000 iterations ("Pbkdf2 failed: iteration counts above 100000 are
 * not supported"). Note that local workerd does *not* enforce this, so a
 * preview build will happily run a count that production refuses.
 *
 * Rather than drop the work factor to the cap, the full count is reached by
 * chaining rounds: each round runs PBKDF2 at the cap and feeds its 256-bit
 * output in as the key material for the next. An attacker testing a candidate
 * password must run every round in sequence, so the work factor is the sum —
 * the same 600,000 iterations, just expressed in six legal calls.
 */
export const PBKDF2_ITERATIONS = 600_000;

/** Hard limit imposed by the Workers runtime on one deriveBits call. */
const MAX_ITERATIONS_PER_CALL = 100_000;

/**
 * Names the construction, not just the primitive, so a future change to the
 * chaining scheme is distinguishable from a plain single-call PBKDF2 hash.
 */
export const PBKDF2_ALGO = 'PBKDF2-SHA256-chained-100k';

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function randomToken(bytes = 32): string {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)).buffer);
}

export async function sha256Hex(input: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(input)));
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  // Start from the password; every later round starts from the previous
  // round's 256-bit output, which is already a high-entropy secret.
  let material: BufferSource = enc.encode(password);
  let bits: ArrayBuffer | null = null;
  let remaining = Math.max(1, iterations);

  while (remaining > 0) {
    const round = Math.min(remaining, MAX_ITERATIONS_PER_CALL);
    remaining -= round;

    const key = await crypto.subtle.importKey('raw', material, 'PBKDF2', false, ['deriveBits']);
    bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: salt as BufferSource, iterations: round, hash: 'SHA-256' },
      key,
      256,
    );
    material = bits;
  }

  return toHex(bits!);
}

export type PasswordRecord = {
  password_hash: string;
  password_salt: string;
  password_algo: string;
  password_iterations: number;
};

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return {
    password_hash: await derive(password, salt, PBKDF2_ITERATIONS),
    password_salt: toHex(salt.buffer),
    password_algo: PBKDF2_ALGO,
    password_iterations: PBKDF2_ITERATIONS,
  };
}

/** Constant-time comparison. Both sides are fixed-length hex digests. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(
  password: string,
  record: Partial<PasswordRecord> | null | undefined,
): Promise<boolean> {
  if (!record?.password_hash || !record.password_salt || !record.password_iterations) {
    // Unclaimed account. Burn comparable CPU so a timing difference does not
    // reveal which of the two addresses is a real, claimed account.
    await derive(password, crypto.getRandomValues(new Uint8Array(16)), PBKDF2_ITERATIONS);
    return false;
  }
  if (record.password_algo !== PBKDF2_ALGO) return false;
  const candidate = await derive(
    password,
    fromHex(record.password_salt),
    record.password_iterations,
  );
  return timingSafeEqual(candidate, record.password_hash);
}
