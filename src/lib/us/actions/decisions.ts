'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import type { ActionState } from '../model';
import { ValidationError, id as parseId, str } from '../validate';

function refresh(decisionId?: string) {
  revalidatePath('/us/decisions');
  if (decisionId) revalidatePath(`/us/decisions/${decisionId}`);
}

export async function createDecisionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let newId: string | null = null;
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const question = str(formData.get('question'), 'Question', { min: 3, max: 200 });
    const context = str(formData.get('context'), 'Context', { max: 2000, optional: true });

    const now = Date.now();
    newId = crypto.randomUUID();

    await getDb()
      .prepare(
        `INSERT INTO decisions (id, question, context, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?5)`,
      )
      .bind(newId, question, context || null, user.id, now)
      .run();

    await notify({
      userId: partner.id,
      kind: 'decision_created',
      title: `${user.name} opened a decision`,
      body: question,
      href: `/us/decisions/${newId}`,
      refType: 'decision',
      refId: newId,
    });

    refresh(newId);
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
  redirect(`/us/decisions/${newId}`);
}

/**
 * Each person owns exactly one block of thoughts per decision. The UNIQUE
 * (decision_id, user_id) index plus `user_id = ?` means you can only ever
 * write your own — never overwrite your partner's.
 */
export async function saveThoughtAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const decisionId = parseId(formData.get('decision_id'), 'Decision');
    const body = str(formData.get('body'), 'Your thoughts', { min: 1, max: 4000 });

    const db = getDb();
    const decision = await db
      .prepare('SELECT question FROM decisions WHERE id = ?1')
      .bind(decisionId)
      .first<{ question: string }>();
    if (!decision) return { ok: false, message: 'That decision no longer exists.' };

    const existing = await db
      .prepare('SELECT id FROM decision_thoughts WHERE decision_id = ?1 AND user_id = ?2')
      .bind(decisionId, user.id)
      .first<{ id: string }>();

    const now = Date.now();
    await db
      .prepare(
        `INSERT INTO decision_thoughts (id, decision_id, user_id, body, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT (decision_id, user_id) DO UPDATE SET body = ?4, updated_at = ?5`,
      )
      .bind(crypto.randomUUID(), decisionId, user.id, body, now)
      .run();

    await db
      .prepare('UPDATE decisions SET updated_at = ?2 WHERE id = ?1')
      .bind(decisionId, now)
      .run();

    if (!existing) {
      await notify({
        userId: partner.id,
        kind: 'thought_added',
        title: `${user.name} shared their thinking`,
        body: decision.question,
        href: `/us/decisions/${decisionId}`,
        refType: 'decision',
        refId: decisionId,
      });
    }

    refresh(decisionId);
    return { ok: true, message: 'Saved.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function decideAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const decisionId = parseId(formData.get('decision_id'), 'Decision');
    const outcome = str(formData.get('outcome'), 'Our decision', { min: 2, max: 2000 });

    const db = getDb();
    const now = Date.now();
    const result = await db
      .prepare(
        `UPDATE decisions SET outcome = ?2, status = 'decided', decided_at = ?3, updated_at = ?3
          WHERE id = ?1`,
      )
      .bind(decisionId, outcome, now)
      .run();
    if (!result.meta.changes) return { ok: false, message: 'That decision no longer exists.' };

    const decision = await db
      .prepare('SELECT question FROM decisions WHERE id = ?1')
      .bind(decisionId)
      .first<{ question: string }>();

    await notify({
      userId: partner.id,
      kind: 'decision_made',
      title: `${user.name} recorded our decision`,
      body: decision?.question ?? outcome,
      href: `/us/decisions/${decisionId}`,
      refType: 'decision',
      refId: decisionId,
    });

    refresh(decisionId);
    return { ok: true, message: 'Recorded.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function reopenDecisionAction(formData: FormData): Promise<void> {
  await requireUser();
  const decisionId = parseId(formData.get('decision_id'), 'Decision');
  await getDb()
    .prepare(
      `UPDATE decisions SET status = 'open', decided_at = NULL, updated_at = ?2 WHERE id = ?1`,
    )
    .bind(decisionId, Date.now())
    .run();
  refresh(decisionId);
}

export async function deleteDecisionAction(formData: FormData): Promise<void> {
  await requireUser();
  const decisionId = parseId(formData.get('decision_id'), 'Decision');
  await getDb().prepare('DELETE FROM decisions WHERE id = ?1').bind(decisionId).run();
  refresh();
  redirect('/us/decisions');
}
