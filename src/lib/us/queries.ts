import 'server-only';
import { getDb } from './env';
import type {
  Category,
  GoalStatus,
  Horizon,
  NotificationKind,
  SignalKind,
  SurpriseKind,
} from './model';

/**
 * Every read the private app performs. Each function takes the caller's user
 * id and filters on it where the row is addressed to a person, so a page can
 * never render another account's private content by forgetting a WHERE.
 */

/* --------------------------------- signals --------------------------------- */

export type SignalRow = {
  id: string;
  kind: SignalKind;
  from_user_id: string;
  to_user_id: string;
  created_at: number;
  acknowledged_at: number | null;
  from_name: string;
};

export async function getPendingSignals(userId: string): Promise<SignalRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT s.id, s.kind, s.from_user_id, s.to_user_id, s.created_at, s.acknowledged_at,
              u.name AS from_name
         FROM signals s JOIN users u ON u.id = s.from_user_id
        WHERE s.to_user_id = ?1 AND s.acknowledged_at IS NULL
        ORDER BY s.created_at DESC LIMIT 20`,
    )
    .bind(userId)
    .all<SignalRow>();
  return results ?? [];
}

export async function getSignalHistory(userId: string, limit = 40): Promise<SignalRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT s.id, s.kind, s.from_user_id, s.to_user_id, s.created_at, s.acknowledged_at,
              u.name AS from_name
         FROM signals s JOIN users u ON u.id = s.from_user_id
        WHERE s.to_user_id = ?1 OR s.from_user_id = ?1
        ORDER BY s.created_at DESC LIMIT ?2`,
    )
    .bind(userId, limit)
    .all<SignalRow>();
  return results ?? [];
}

/* ------------------------------ notifications ------------------------------ */

export type NotificationRow = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string | null;
  href: string | null;
  read_at: number | null;
  created_at: number;
};

export async function getUnreadCount(userId: string): Promise<number> {
  const row = await getDb()
    .prepare('SELECT COUNT(*) AS n FROM notifications WHERE user_id = ?1 AND read_at IS NULL')
    .bind(userId)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function getNotifications(userId: string, limit = 60): Promise<NotificationRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT id, kind, title, body, href, read_at, created_at
         FROM notifications WHERE user_id = ?1
        ORDER BY created_at DESC LIMIT ?2`,
    )
    .bind(userId, limit)
    .all<NotificationRow>();
  return results ?? [];
}

/* ---------------------------------- goals ---------------------------------- */

export type GoalRow = {
  id: string;
  title: string;
  description: string | null;
  category: Category;
  horizon: Horizon;
  target_date: string | null;
  status: GoalStatus;
  progress: number;
  assigned_to: string;
  created_by: string;
  created_at: number;
  updated_at: number;
  creator_name: string;
};

export async function getGoals(): Promise<GoalRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT g.*, u.name AS creator_name
         FROM goals g JOIN users u ON u.id = g.created_by
        ORDER BY CASE g.status WHEN 'done' THEN 1 ELSE 0 END,
                 g.target_date IS NULL, g.target_date, g.created_at DESC`,
    )
    .all<GoalRow>();
  return results ?? [];
}

export async function getGoal(id: string): Promise<GoalRow | null> {
  return getDb()
    .prepare(
      `SELECT g.*, u.name AS creator_name
         FROM goals g JOIN users u ON u.id = g.created_by WHERE g.id = ?1`,
    )
    .bind(id)
    .first<GoalRow>();
}

/* ---------------------------------- plans ---------------------------------- */

export type PlanRow = {
  id: string;
  title: string;
  note: string | null;
  done_at: number | null;
  done_by: string | null;
  created_by: string;
  created_at: number;
  position: number;
  done_by_name: string | null;
};

export async function getPlans(): Promise<PlanRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT p.*, u.name AS done_by_name
         FROM plans p LEFT JOIN users u ON u.id = p.done_by
        ORDER BY p.done_at IS NOT NULL, p.position, p.created_at DESC`,
    )
    .all<PlanRow>();
  return results ?? [];
}

/* ------------------------------ pick for us -------------------------------- */

export type ActivityRow = { id: string; label: string; created_at: number; created_by: string };

export async function getActivities(): Promise<ActivityRow[]> {
  const { results } = await getDb()
    .prepare(
      'SELECT id, label, created_at, created_by FROM activities WHERE archived_at IS NULL ORDER BY created_at',
    )
    .all<ActivityRow>();
  return results ?? [];
}

export type PickRow = { id: string; label: string; created_at: number; picked_by_name: string };

export async function getLastPick(): Promise<PickRow | null> {
  return getDb()
    .prepare(
      `SELECT p.id, a.label, p.created_at, u.name AS picked_by_name
         FROM picks p JOIN activities a ON a.id = p.activity_id
         JOIN users u ON u.id = p.picked_by
        ORDER BY p.created_at DESC LIMIT 1`,
    )
    .first<PickRow>();
}

/* -------------------------------- decisions -------------------------------- */

export type DecisionRow = {
  id: string;
  question: string;
  context: string | null;
  status: 'open' | 'decided';
  outcome: string | null;
  decided_at: number | null;
  created_by: string;
  created_at: number;
  updated_at: number;
};

export type ThoughtRow = {
  id: string;
  decision_id: string;
  user_id: string;
  body: string;
  updated_at: number;
};

export async function getDecisions(): Promise<DecisionRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT * FROM decisions
        ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, updated_at DESC`,
    )
    .all<DecisionRow>();
  return results ?? [];
}

export async function getDecision(id: string): Promise<DecisionRow | null> {
  return getDb().prepare('SELECT * FROM decisions WHERE id = ?1').bind(id).first<DecisionRow>();
}

export async function getThoughts(decisionId: string): Promise<ThoughtRow[]> {
  const { results } = await getDb()
    .prepare('SELECT * FROM decision_thoughts WHERE decision_id = ?1')
    .bind(decisionId)
    .all<ThoughtRow>();
  return results ?? [];
}

/* ---------------------------- monthly priorities --------------------------- */

export type PriorityRow = {
  id: string;
  month: string;
  label: string;
  icon: string | null;
  note: string | null;
  done_at: number | null;
  position: number;
  created_by: string;
};

export async function getPriorities(month: string): Promise<PriorityRow[]> {
  const { results } = await getDb()
    .prepare(
      'SELECT * FROM monthly_priorities WHERE month = ?1 ORDER BY position, rowid',
    )
    .bind(month)
    .all<PriorityRow>();
  return results ?? [];
}

/* --------------------------------- sealed ---------------------------------- */

/**
 * Sealed rows are returned *without* their body unless the caller is allowed
 * to read it — the author always, the recipient only once it is opened and
 * past its unlock time. The body never reaches the browser early.
 */
export type SealedRow = {
  id: string;
  title: string;
  body: string | null;
  author_id: string;
  recipient_id: string;
  unlock_at: number | null;
  opened_at: number | null;
  created_at: number;
  author_name: string;
  locked: boolean;
};

function seal<T extends { body: string | null; author_id: string; opened_at: number | null; unlock_at: number | null }>(
  row: T,
  viewerId: string,
  now: number,
): T & { locked: boolean } {
  const isAuthor = row.author_id === viewerId;
  const timeReached = !row.unlock_at || row.unlock_at <= now;
  const readable = isAuthor || (row.opened_at !== null && timeReached);
  return { ...row, body: readable ? row.body : null, locked: !readable };
}

export type OpenWhenRow = SealedRow & { prompt: string };

export async function getOpenWhenNotes(viewerId: string): Promise<OpenWhenRow[]> {
  const now = Date.now();
  const { results } = await getDb()
    .prepare(
      `SELECT n.id, n.prompt, n.prompt AS title, n.body, n.author_id, n.recipient_id,
              n.unlock_at, n.opened_at, n.created_at, u.name AS author_name
         FROM open_when_notes n JOIN users u ON u.id = n.author_id
        WHERE n.author_id = ?1 OR n.recipient_id = ?1
        ORDER BY n.opened_at IS NOT NULL, n.created_at DESC`,
    )
    .bind(viewerId)
    .all<OpenWhenRow>();
  return (results ?? []).map((r) => seal(r, viewerId, now));
}

export type SurpriseRow = SealedRow & { number: number; kind: SurpriseKind };

export async function getSurprises(viewerId: string): Promise<SurpriseRow[]> {
  const now = Date.now();
  const { results } = await getDb()
    .prepare(
      `SELECT s.id, s.number, s.title, s.body, s.kind, s.author_id, s.recipient_id,
              s.unlock_at, s.opened_at, s.created_at, u.name AS author_name
         FROM surprises s JOIN users u ON u.id = s.author_id
        WHERE s.author_id = ?1 OR s.recipient_id = ?1
        ORDER BY s.opened_at IS NOT NULL, s.number DESC`,
    )
    .bind(viewerId)
    .all<SurpriseRow>();
  return (results ?? []).map((r) => seal(r, viewerId, now));
}

export async function getSurprise(id: string, viewerId: string): Promise<SurpriseRow | null> {
  const row = await getDb()
    .prepare(
      `SELECT s.id, s.number, s.title, s.body, s.kind, s.author_id, s.recipient_id,
              s.unlock_at, s.opened_at, s.created_at, u.name AS author_name
         FROM surprises s JOIN users u ON u.id = s.author_id
        WHERE s.id = ?1 AND (s.author_id = ?2 OR s.recipient_id = ?2)`,
    )
    .bind(id, viewerId)
    .first<SurpriseRow>();
  return row ? seal(row, viewerId, Date.now()) : null;
}

/* --------------------------------- story ----------------------------------- */

export type TimelineRow = {
  id: string;
  title: string;
  event_date: string;
  description: string | null;
  created_by: string;
  created_at: number;
  creator_name: string;
};

export async function getTimeline(): Promise<TimelineRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT t.*, u.name AS creator_name
         FROM timeline_events t JOIN users u ON u.id = t.created_by
        ORDER BY t.event_date DESC, t.created_at DESC`,
    )
    .all<TimelineRow>();
  return results ?? [];
}

/* -------------------------------- dashboard -------------------------------- */

export type HomeSummary = {
  lastSignal: { kind: SignalKind; from_name: string; created_at: number; mine: boolean } | null;
  signalsThisWeek: number;
  openPlans: number;
  donePlans: number;
  activeGoals: number;
  nextDated: { id: string; title: string; target_date: string; category: Category } | null;
  upcoming: { id: string; title: string; target_date: string | null; category: Category; horizon: Horizon }[];
};

/** One round-trip batch for the home screen. */
export async function getHomeSummary(userId: string): Promise<HomeSummary> {
  const db = getDb();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const today = new Date().toISOString().slice(0, 10);

  const [last, week, plans, goals, dated, upcoming] = await db.batch([
    db
      .prepare(
        `SELECT s.kind, s.from_user_id, s.created_at, u.name AS from_name
           FROM signals s JOIN users u ON u.id = s.from_user_id
          WHERE s.from_user_id = ?1 OR s.to_user_id = ?1
          ORDER BY s.created_at DESC LIMIT 1`,
      )
      .bind(userId),
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM signals
          WHERE (from_user_id = ?1 OR to_user_id = ?1) AND created_at > ?2`,
      )
      .bind(userId, weekAgo),
    db.prepare(
      `SELECT SUM(done_at IS NULL) AS open, SUM(done_at IS NOT NULL) AS done FROM plans`,
    ),
    db.prepare(`SELECT COUNT(*) AS n FROM goals WHERE status IN ('planned','active')`),
    db
      .prepare(
        `SELECT id, title, target_date, category FROM goals
          WHERE status IN ('planned','active') AND target_date IS NOT NULL AND target_date >= ?1
          ORDER BY target_date LIMIT 1`,
      )
      .bind(today),
    db.prepare(
      `SELECT id, title, target_date, category, horizon FROM goals
        WHERE status IN ('planned','active')
        ORDER BY target_date IS NULL, target_date, created_at DESC LIMIT 3`,
    ),
  ]);

  const lastRow = (last.results?.[0] ?? null) as
    | { kind: SignalKind; from_user_id: string; created_at: number; from_name: string }
    | null;
  const planRow = (plans.results?.[0] ?? {}) as { open: number | null; done: number | null };

  return {
    lastSignal: lastRow
      ? {
          kind: lastRow.kind,
          from_name: lastRow.from_name,
          created_at: lastRow.created_at,
          mine: lastRow.from_user_id === userId,
        }
      : null,
    signalsThisWeek: ((week.results?.[0] as { n: number } | undefined)?.n ?? 0),
    openPlans: planRow.open ?? 0,
    donePlans: planRow.done ?? 0,
    activeGoals: ((goals.results?.[0] as { n: number } | undefined)?.n ?? 0),
    nextDated: (dated.results?.[0] ?? null) as HomeSummary['nextDated'],
    upcoming: (upcoming.results ?? []) as HomeSummary['upcoming'],
  };
}
