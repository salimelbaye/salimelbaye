'use server';

import { revalidatePath } from 'next/cache';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import { PRIORITY_ICONS, currentMonth, formatMonth, type ActionState } from '../model';
import { ValidationError, id as parseId, isoMonth, oneOf, str } from '../validate';

function refresh() {
  revalidatePath('/us');
  revalidatePath('/us/this-month');
}

/** Deliberately capped: a month with ten priorities has none. */
const MAX_PER_MONTH = 5;

export async function addPriorityAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const month = isoMonth(formData.get('month') ?? currentMonth(), 'Month');
    const label = str(formData.get('label'), 'Priority', { min: 2, max: 80 });
    const icon = oneOf(formData.get('icon'), PRIORITY_ICONS, 'Icon');
    const note = str(formData.get('note'), 'Note', { max: 300, optional: true });

    const db = getDb();
    const count = await db
      .prepare('SELECT COUNT(*) AS n FROM monthly_priorities WHERE month = ?1')
      .bind(month)
      .first<{ n: number }>();
    if ((count?.n ?? 0) >= MAX_PER_MONTH) {
      return { ok: false, message: `Keep it to ${MAX_PER_MONTH}. That is the point.` };
    }

    await db
      .prepare(
        `INSERT INTO monthly_priorities (id, month, label, icon, note, position, created_by, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      )
      .bind(
        crypto.randomUUID(),
        month,
        label,
        icon,
        note || null,
        (count?.n ?? 0) + 1,
        user.id,
        Date.now(),
      )
      .run();

    await notify({
      userId: partner.id,
      kind: 'month_updated',
      title: `${user.name} set a priority for ${formatMonth(month)}`,
      body: `${icon} ${label}`,
      href: '/us/this-month',
      refType: 'month',
    });

    refresh();
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function togglePriorityAction(formData: FormData): Promise<void> {
  await requireUser();
  const priorityId = parseId(formData.get('id'), 'Priority');
  const db = getDb();
  const row = await db
    .prepare('SELECT done_at FROM monthly_priorities WHERE id = ?1')
    .bind(priorityId)
    .first<{ done_at: number | null }>();
  if (!row) return;

  await db
    .prepare('UPDATE monthly_priorities SET done_at = ?2 WHERE id = ?1')
    .bind(priorityId, row.done_at ? null : Date.now())
    .run();
  refresh();
}

export async function removePriorityAction(formData: FormData): Promise<void> {
  await requireUser();
  const priorityId = parseId(formData.get('id'), 'Priority');
  await getDb().prepare('DELETE FROM monthly_priorities WHERE id = ?1').bind(priorityId).run();
  refresh();
}
