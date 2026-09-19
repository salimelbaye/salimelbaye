'use server';

import { revalidatePath } from 'next/cache';
import { requirePartner, requireUser } from '../auth';
import { getDb } from '../env';
import { notify } from '../notify';
import type { ActionState } from '../model';
import { ValidationError, id as parseId, isoDate, str } from '../validate';

function refresh() {
  revalidatePath('/us/story');
}

export async function addMilestoneAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const partner = await requirePartner(user);
    const title = str(formData.get('title'), 'Title', { min: 2, max: 160 });
    const eventDate = isoDate(formData.get('event_date'), 'Date', { optional: false });
    const description = str(formData.get('description'), 'What happened', {
      max: 4000,
      optional: true,
    });

    const now = Date.now();
    const id = crypto.randomUUID();
    await getDb()
      .prepare(
        `INSERT INTO timeline_events (id, title, event_date, description, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)`,
      )
      .bind(id, title, eventDate, description || null, user.id, now)
      .run();

    await notify({
      userId: partner.id,
      kind: 'milestone_added',
      title: `${user.name} added to our story`,
      body: title,
      href: '/us/story',
      refType: 'milestone',
      refId: id,
    });

    refresh();
    return { ok: true, message: 'Added.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

export async function deleteMilestoneAction(formData: FormData): Promise<void> {
  await requireUser();
  const eventId = parseId(formData.get('id'), 'Milestone');
  await getDb().prepare('DELETE FROM timeline_events WHERE id = ?1').bind(eventId).run();
  refresh();
}
