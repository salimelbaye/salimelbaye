'use server';

import { revalidatePath } from 'next/cache';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import type { ActionState } from '../model';
import { ValidationError, id as parseId, str } from '../validate';

function refresh() {
  revalidatePath('/us');
  revalidatePath('/us/plans');
}

export async function addPlanAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const title = str(formData.get('title'), 'Idea', { min: 2, max: 160 });
    const note = str(formData.get('note'), 'Note', { max: 500, optional: true });

    const db = getDb();
    const max = await db
      .prepare('SELECT COALESCE(MAX(position), 0) AS p FROM plans')
      .first<{ p: number }>();

    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO plans (id, title, note, created_by, created_at, position)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
      )
      .bind(id, title, note || null, user.id, Date.now(), (max?.p ?? 0) + 1)
      .run();

    await notify({
      userId: partner.id,
      kind: 'plan_created',
      title: `${user.name} added something for us to do`,
      body: title,
      href: '/us/plans',
      refType: 'plan',
      refId: id,
    });

    refresh();
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

/** Ticking and un-ticking are the same action, so a mis-tap is easy to undo. */
export async function togglePlanAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const planId = parseId(formData.get('id'), 'Plan');

  const db = getDb();
  const row = await db
    .prepare('SELECT title, done_at FROM plans WHERE id = ?1')
    .bind(planId)
    .first<{ title: string; done_at: number | null }>();
  if (!row) return;

  if (row.done_at) {
    await db
      .prepare('UPDATE plans SET done_at = NULL, done_by = NULL WHERE id = ?1')
      .bind(planId)
      .run();
  } else {
    await db
      .prepare('UPDATE plans SET done_at = ?2, done_by = ?3 WHERE id = ?1')
      .bind(planId, Date.now(), user.id)
      .run();
    await notify({
      userId: partner.id,
      kind: 'plan_completed',
      title: `${user.name} ticked something off`,
      body: row.title,
      href: '/us/plans',
      refType: 'plan',
      refId: planId,
    });
  }

  refresh();
}

export async function deletePlanAction(formData: FormData): Promise<void> {
  await requireUser();
  const planId = parseId(formData.get('id'), 'Plan');
  await getDb().prepare('DELETE FROM plans WHERE id = ?1').bind(planId).run();
  refresh();
}
