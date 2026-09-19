'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '../auth';
import { getDb } from '../env';

/** `user_id = ?` is the authorization: you can only clear your own feed. */
export async function markAllReadAction(): Promise<void> {
  const user = await requireUser();
  await getDb()
    .prepare('UPDATE notifications SET read_at = ?2 WHERE user_id = ?1 AND read_at IS NULL')
    .bind(user.id, Date.now())
    .run();
  revalidatePath('/us/notifications');
  revalidatePath('/us');
}
