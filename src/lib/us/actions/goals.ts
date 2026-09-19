'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import {
  CATEGORIES,
  GOAL_STATUSES,
  HORIZONS,
  type ActionState,
  type GoalStatus,
} from '../model';
import {
  ValidationError,
  id as parseId,
  int,
  isoDate,
  oneOf,
  str,
} from '../validate';

function refresh(goalId?: string) {
  revalidatePath('/us');
  revalidatePath('/us/life-plan');
  if (goalId) revalidatePath(`/us/life-plan/${goalId}`);
}

/** 'both', or one of the two real account ids — nothing else. */
async function parseAssignee(
  value: FormDataEntryValue | null,
  userId: string,
  partnerId: string,
): Promise<string> {
  const v = typeof value === 'string' ? value.trim() : 'both';
  if (v === 'both' || v === userId || v === partnerId) return v;
  throw new ValidationError('Choose who this is for.');
}

export async function createGoalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let newId: string | null = null;
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);

    const title = str(formData.get('title'), 'Title', { min: 2, max: 160 });
    const description = str(formData.get('description'), 'Description', {
      max: 4000,
      optional: true,
    });
    const category = oneOf(formData.get('category'), CATEGORIES, 'Category');
    const horizon = oneOf(formData.get('horizon'), HORIZONS, 'When');
    const targetDate = isoDate(formData.get('target_date'), 'Target date');
    const assignedTo = await parseAssignee(formData.get('assigned_to'), user.id, partner.id);

    const now = Date.now();
    newId = crypto.randomUUID();

    await getDb()
      .prepare(
        `INSERT INTO goals (id, title, description, category, horizon, target_date,
                            status, progress, assigned_to, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'planned', 0, ?7, ?8, ?9, ?9)`,
      )
      .bind(
        newId,
        title,
        description || null,
        category,
        horizon,
        targetDate || null,
        assignedTo,
        user.id,
        now,
      )
      .run();

    await notify({
      userId: partner.id,
      kind: 'goal_created',
      title: `${user.name} added a goal`,
      body: title,
      href: `/us/life-plan/${newId}`,
      refType: 'goal',
      refId: newId,
    });

    refresh(newId);
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
  redirect(`/us/life-plan/${newId}`);
}

export async function updateGoalAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const goalId = parseId(formData.get('id'), 'Goal');

    const title = str(formData.get('title'), 'Title', { min: 2, max: 160 });
    const description = str(formData.get('description'), 'Description', {
      max: 4000,
      optional: true,
    });
    const category = oneOf(formData.get('category'), CATEGORIES, 'Category');
    const horizon = oneOf(formData.get('horizon'), HORIZONS, 'When');
    const targetDate = isoDate(formData.get('target_date'), 'Target date');
    const status = oneOf(formData.get('status'), GOAL_STATUSES, 'Status') as GoalStatus;
    const progress = int(formData.get('progress'), 'Progress', { min: 0, max: 100 });
    const assignedTo = await parseAssignee(formData.get('assigned_to'), user.id, partner.id);

    const db = getDb();
    const before = await db
      .prepare('SELECT status, title FROM goals WHERE id = ?1')
      .bind(goalId)
      .first<{ status: GoalStatus; title: string }>();
    if (!before) return { ok: false, message: 'That goal no longer exists.' };

    // Finishing a goal pins progress to 100 so the two can never disagree.
    const finalProgress = status === 'done' ? 100 : progress;

    await db
      .prepare(
        `UPDATE goals SET title = ?2, description = ?3, category = ?4, horizon = ?5,
                          target_date = ?6, status = ?7, progress = ?8, assigned_to = ?9,
                          updated_at = ?10
          WHERE id = ?1`,
      )
      .bind(
        goalId,
        title,
        description || null,
        category,
        horizon,
        targetDate || null,
        status,
        finalProgress,
        assignedTo,
        Date.now(),
      )
      .run();

    if (status === 'done' && before.status !== 'done') {
      await notify({
        userId: partner.id,
        kind: 'goal_completed',
        title: `${user.name} marked a goal done`,
        body: title,
        href: `/us/life-plan/${goalId}`,
        refType: 'goal',
        refId: goalId,
      });
    }

    refresh(goalId);
    return { ok: true, message: 'Saved.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

/** One-tap progress from the goal screen. */
export async function setProgressAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const goalId = parseId(formData.get('id'), 'Goal');
  const progress = int(formData.get('progress'), 'Progress', { min: 0, max: 100 });
  const status = progress === 100 ? 'done' : progress > 0 ? 'active' : 'planned';

  const db = getDb();
  const before = await db
    .prepare('SELECT status, title FROM goals WHERE id = ?1')
    .bind(goalId)
    .first<{ status: GoalStatus; title: string }>();
  if (!before) return;

  await db
    .prepare('UPDATE goals SET progress = ?2, status = ?3, updated_at = ?4 WHERE id = ?1')
    .bind(goalId, progress, status, Date.now())
    .run();

  if (status === 'done' && before.status !== 'done') {
    await notify({
      userId: partner.id,
      kind: 'goal_completed',
      title: `${user.name} marked a goal done`,
      body: before.title,
      href: `/us/life-plan/${goalId}`,
      refType: 'goal',
      refId: goalId,
    });
  }

  refresh(goalId);
}

export async function deleteGoalAction(formData: FormData): Promise<void> {
  await requireUser();
  const goalId = parseId(formData.get('id'), 'Goal');
  await getDb().prepare('DELETE FROM goals WHERE id = ?1').bind(goalId).run();
  refresh();
  redirect('/us/life-plan');
}
