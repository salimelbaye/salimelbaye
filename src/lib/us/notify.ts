import 'server-only';
import { getDb } from './env';
import type { NotificationKind } from './model';

export type NewNotification = {
  userId: string;
  kind: NotificationKind;
  title: string;
  body?: string | null;
  href?: string | null;
  refType?: string | null;
  refId?: string | null;
};

/**
 * Notifications are addressed to one user. Callers pass the *partner's* id
 * when an action should surface on the other person's screen; nothing here
 * ever fans out to both.
 */
export async function notify(n: NewNotification): Promise<void> {
  await getDb()
    .prepare(
      `INSERT INTO notifications (id, user_id, kind, title, body, href, ref_type, ref_id, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
    )
    .bind(
      crypto.randomUUID(),
      n.userId,
      n.kind,
      n.title.slice(0, 160),
      n.body?.slice(0, 400) ?? null,
      n.href ?? null,
      n.refType ?? null,
      n.refId ?? null,
      Date.now(),
    )
    .run();

  // Keep the feed bounded; this is a two-person app, not an inbox.
  await getDb()
    .prepare(
      `DELETE FROM notifications
        WHERE user_id = ?1
          AND id NOT IN (
            SELECT id FROM notifications WHERE user_id = ?1 ORDER BY created_at DESC LIMIT 150
          )`,
    )
    .bind(n.userId)
    .run();
}
