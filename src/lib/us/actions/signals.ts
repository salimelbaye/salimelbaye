'use server';

import { revalidatePath } from 'next/cache';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import { rateLimit } from '../rate-limit';
import { ACK_TEXT, SIGNAL, SIGNAL_KINDS, type ActionState } from '../model';
import { ValidationError, id as parseId, oneOf } from '../validate';

/** Repeating the same unacknowledged signal inside this window is a no-op. */
const DEDUPE_MS = 10 * 60 * 1000;

function refresh() {
  revalidatePath('/us');
  revalidatePath('/us/signals');
  revalidatePath('/us/together');
  revalidatePath('/us/notifications');
}

export async function sendSignalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const kind = oneOf(formData.get('kind'), SIGNAL_KINDS, 'Signal');

    const limited = await rateLimit(`signal:${user.id}`, 30, 60 * 60 * 1000);
    if (!limited.ok) {
      return { ok: false, message: 'That is a lot of signals. Give it a few minutes.' };
    }

    const db = getDb();
    const now = Date.now();

    const recent = await db
      .prepare(
        `SELECT id FROM signals
          WHERE from_user_id = ?1 AND to_user_id = ?2 AND kind = ?3
            AND acknowledged_at IS NULL AND created_at > ?4
          LIMIT 1`,
      )
      .bind(user.id, partner.id, kind, now - DEDUPE_MS)
      .first<{ id: string }>();

    if (recent) {
      return { ok: true, message: `${partner.name} already knows.` };
    }

    await db
      .prepare(
        `INSERT INTO signals (id, from_user_id, to_user_id, kind, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)`,
      )
      .bind(crypto.randomUUID(), user.id, partner.id, kind, now)
      .run();

    await notify({
      userId: partner.id,
      kind: 'signal',
      title: `${user.name} ${SIGNAL[kind].received}`,
      href: '/us/signals',
      refType: 'signal',
    });

    refresh();
    return { ok: true, message: `Sent to ${partner.name}.` };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function acknowledgeSignalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const signalId = parseId(formData.get('id'), 'Signal');

    // `to_user_id = ?` is the authorization: only the person a signal was
    // addressed to can acknowledge it, and only once.
    const result = await getDb()
      .prepare(
        `UPDATE signals SET acknowledged_at = ?2
          WHERE id = ?1 AND to_user_id = ?3 AND acknowledged_at IS NULL`,
      )
      .bind(signalId, Date.now(), user.id)
      .run();

    if (!result.meta.changes) return { ok: false, message: 'That signal is already answered.' };

    const row = await getDb()
      .prepare('SELECT from_user_id FROM signals WHERE id = ?1')
      .bind(signalId)
      .first<{ from_user_id: string }>();

    if (row) {
      await notify({
        userId: row.from_user_id,
        kind: 'signal_ack',
        title: `${user.name}: ${ACK_TEXT}`,
        href: '/us/signals',
        refType: 'signal',
        refId: signalId,
      });
    }

    refresh();
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

/** Answers every waiting signal at once, from the home screen. */
export async function acknowledgeAllAction(): Promise<void> {
  const user = await requireUser();
  const partner = await requirePartner(user);

  const result = await getDb()
    .prepare(
      'UPDATE signals SET acknowledged_at = ?2 WHERE to_user_id = ?1 AND acknowledged_at IS NULL',
    )
    .bind(user.id, Date.now())
    .run();

  if (result.meta.changes) {
    await notify({
      userId: partner.id,
      kind: 'signal_ack',
      title: `${user.name}: ${ACK_TEXT}`,
      href: '/us/signals',
      refType: 'signal',
    });
  }

  refresh();
}
