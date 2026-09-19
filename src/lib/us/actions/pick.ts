'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '../auth';
import { getDb } from '../env';
import { DEFAULT_ACTIVITIES, type ActionState } from '../model';
import { ValidationError, id as parseId, str } from '../validate';

/** Seeded once, the first time the list would otherwise be empty. */
async function ensureActivities(userId: string): Promise<void> {
  const db = getDb();
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM activities')
    .first<{ n: number }>();
  if ((row?.n ?? 0) > 0) return;

  const now = Date.now();
  await db.batch(
    DEFAULT_ACTIVITIES.map((label, i) =>
      db
        .prepare(
          'INSERT INTO activities (id, label, created_by, created_at) VALUES (?1, ?2, ?3, ?4)',
        )
        .bind(crypto.randomUUID(), label, userId, now + i),
    ),
  );
}

export async function seedActivitiesAction(): Promise<void> {
  const user = await requireUser();
  await ensureActivities(user.id);
  revalidatePath('/us/pick');
}

export async function addActivityAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const label = str(formData.get('label'), 'Activity', { min: 2, max: 120 });
    await getDb()
      .prepare('INSERT INTO activities (id, label, created_by, created_at) VALUES (?1, ?2, ?3, ?4)')
      .bind(crypto.randomUUID(), label, user.id, Date.now())
      .run();
    revalidatePath('/us/pick');
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function removeActivityAction(formData: FormData): Promise<void> {
  await requireUser();
  const activityId = parseId(formData.get('id'), 'Activity');
  // Archived rather than deleted, so past picks keep their label.
  await getDb()
    .prepare('UPDATE activities SET archived_at = ?2 WHERE id = ?1')
    .bind(activityId, Date.now())
    .run();
  revalidatePath('/us/pick');
}

/**
 * Draws an activity, avoiding the last few so it does not repeat itself.
 * Random selection happens in SQL so the whole list never has to be loaded.
 */
export async function pickAction(): Promise<void> {
  const user = await requireUser();
  await ensureActivities(user.id);
  const db = getDb();

  const recent = await db
    .prepare('SELECT activity_id FROM picks ORDER BY created_at DESC LIMIT 3')
    .all<{ activity_id: string }>();
  const avoid = (recent.results ?? []).map((r) => r.activity_id);

  // Built from array indices only ('?1,?2,?3'). No value is ever interpolated
  // into the statement — the ids go through .bind() below.
  const placeholders = avoid.map((_, i) => `?${i + 1}`).join(',');
  const sql = avoid.length
    ? `SELECT id FROM activities WHERE archived_at IS NULL AND id NOT IN (${placeholders})
         ORDER BY RANDOM() LIMIT 1`
    : 'SELECT id FROM activities WHERE archived_at IS NULL ORDER BY RANDOM() LIMIT 1';

  let chosen = await db.prepare(sql).bind(...avoid).first<{ id: string }>();
  // Fewer activities than the avoid window: fall back to the whole list.
  if (!chosen) {
    chosen = await db
      .prepare('SELECT id FROM activities WHERE archived_at IS NULL ORDER BY RANDOM() LIMIT 1')
      .first<{ id: string }>();
  }
  if (!chosen) return;

  await db
    .prepare('INSERT INTO picks (id, activity_id, picked_by, created_at) VALUES (?1, ?2, ?3, ?4)')
    .bind(crypto.randomUUID(), chosen.id, user.id, Date.now())
    .run();

  revalidatePath('/us/pick');
}
