'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import { SURPRISE_KINDS, type ActionState } from '../model';
import { ValidationError, id as parseId, isoDate, oneOf, str } from '../validate';

/**
 * Open When notes and Surprises. Both are written *for* the other person and
 * stay sealed until opened — the body is never sent to the recipient's
 * browser before then (see seal() in queries.ts).
 */

function refresh(path: string, id?: string) {
  revalidatePath(path);
  if (id) revalidatePath(`${path}/${id}`);
  revalidatePath('/us');
}

/** A date input carries no time; unlock at the start of that day, UTC. */
function unlockTimestamp(value: FormDataEntryValue | null): number | null {
  const date = isoDate(value, 'Unlock date');
  return date ? Date.parse(`${date}T00:00:00Z`) : null;
}

/* -------------------------------- open when -------------------------------- */

export async function createOpenWhenAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const prompt = str(formData.get('prompt'), 'Open when…', { min: 2, max: 120 });
    const body = str(formData.get('body'), 'The note', { min: 1, max: 6000 });
    const unlockAt = unlockTimestamp(formData.get('unlock_at'));

    const id = crypto.randomUUID();
    await getDb()
      .prepare(
        `INSERT INTO open_when_notes (id, prompt, body, author_id, recipient_id, unlock_at, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
      )
      .bind(id, prompt, body, user.id, partner.id, unlockAt, Date.now())
      .run();

    await notify({
      userId: partner.id,
      kind: 'open_when_created',
      title: `${user.name} left you a note`,
      body: `Open when ${prompt}`,
      href: '/us/open-when',
      refType: 'open_when',
      refId: id,
    });

    refresh('/us/open-when');
    return { ok: true, message: 'Sealed.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

/**
 * Opening is one-way and only the recipient can do it — `recipient_id = ?`
 * and `opened_at IS NULL` are the authorization, and the unlock time is
 * enforced here rather than trusted from the client.
 */
export async function openNoteAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const noteId = parseId(formData.get('id'), 'Note');
  const now = Date.now();

  const db = getDb();
  const result = await db
    .prepare(
      `UPDATE open_when_notes SET opened_at = ?2
        WHERE id = ?1 AND recipient_id = ?3 AND opened_at IS NULL
          AND (unlock_at IS NULL OR unlock_at <= ?2)`,
    )
    .bind(noteId, now, user.id)
    .run();

  if (result.meta.changes) {
    const row = await db
      .prepare('SELECT author_id, prompt FROM open_when_notes WHERE id = ?1')
      .bind(noteId)
      .first<{ author_id: string; prompt: string }>();
    if (row) {
      await notify({
        userId: row.author_id,
        kind: 'open_when_created',
        title: `${user.name} opened your note`,
        body: `Open when ${row.prompt}`,
        href: '/us/open-when',
        refType: 'open_when',
        refId: noteId,
      });
    }
  }

  refresh('/us/open-when');
}

export async function deleteOpenWhenAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const noteId = parseId(formData.get('id'), 'Note');
  // Only the author can withdraw a note.
  await getDb()
    .prepare('DELETE FROM open_when_notes WHERE id = ?1 AND author_id = ?2')
    .bind(noteId, user.id)
    .run();
  refresh('/us/open-when');
}

/* -------------------------------- surprises -------------------------------- */

export async function createSurpriseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const title = str(formData.get('title'), 'Title', { min: 2, max: 120 });
    const body = str(formData.get('body'), 'The surprise', { min: 1, max: 6000 });
    const kind = oneOf(formData.get('kind'), SURPRISE_KINDS, 'Kind');
    const unlockAt = unlockTimestamp(formData.get('unlock_at'));

    const db = getDb();
    const max = await db
      .prepare('SELECT COALESCE(MAX(number), 0) AS n FROM surprises')
      .first<{ n: number }>();
    const number = (max?.n ?? 0) + 1;

    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO surprises (id, number, title, body, kind, author_id, recipient_id, unlock_at, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
      )
      .bind(id, number, title, body, kind, user.id, partner.id, unlockAt, Date.now())
      .run();

    await notify({
      userId: partner.id,
      kind: 'surprise_created',
      title: `${user.name} left you a surprise`,
      body: `Surprise #${String(number).padStart(3, '0')} is waiting`,
      href: '/us/surprises',
      refType: 'surprise',
      refId: id,
    });

    refresh('/us/surprises');
    return { ok: true, message: 'Sealed.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function openSurpriseAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const surpriseId = parseId(formData.get('id'), 'Surprise');
  const now = Date.now();

  const db = getDb();
  const result = await db
    .prepare(
      `UPDATE surprises SET opened_at = ?2
        WHERE id = ?1 AND recipient_id = ?3 AND opened_at IS NULL
          AND (unlock_at IS NULL OR unlock_at <= ?2)`,
    )
    .bind(surpriseId, now, user.id)
    .run();

  if (result.meta.changes) {
    const row = await db
      .prepare('SELECT author_id, number FROM surprises WHERE id = ?1')
      .bind(surpriseId)
      .first<{ author_id: string; number: number }>();
    if (row) {
      await notify({
        userId: row.author_id,
        kind: 'surprise_opened',
        title: `${user.name} opened Surprise #${String(row.number).padStart(3, '0')}`,
        href: `/us/surprises/${surpriseId}`,
        refType: 'surprise',
        refId: surpriseId,
      });
    }
  }

  redirect(`/us/surprises/${surpriseId}`);
}

export async function deleteSurpriseAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const surpriseId = parseId(formData.get('id'), 'Surprise');
  await getDb()
    .prepare('DELETE FROM surprises WHERE id = ?1 AND author_id = ?2')
    .bind(surpriseId, user.id)
    .run();
  refresh('/us/surprises');
  redirect('/us/surprises');
}
