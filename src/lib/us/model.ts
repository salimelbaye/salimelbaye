/**
 * Shared vocabulary for the private app. Safe to import from client
 * components — it holds no secrets and touches no bindings.
 */

export const APP_NAME = 'Hajar & Salim';
/**
 * Minimum password length.
 *
 * Lowered from 12 to 11 at the owner's explicit direction so the chosen
 * initial password could be used. This is a deliberate weakening of the
 * policy, not an oversight: /us sits at a guessable URL, so the password is
 * the whole security boundary. Raise this back to 12+ once both accounts
 * have moved to stronger, per-person passwords — nothing else depends on the
 * value, and existing hashes are unaffected by changing it.
 */
export const MIN_PASSWORD_LENGTH = 11;
export const APP_TAGLINE = 'Our little world.';

/** What every server action in the app resolves to. */
export type ActionState = { ok: boolean; message?: string } | null;

/* ---------------------------------- signals -------------------------------- */

export const SIGNAL_KINDS = [
  'miss_you',
  'need_you',
  'want_to_see_you',
  'call_me',
  'thinking_of_you',
  'im_okay',
] as const;
export type SignalKind = (typeof SIGNAL_KINDS)[number];

type SignalMeta = {
  /** Shown on the button the sender presses. */
  action: string;
  /** Shown to the receiver: "Hajar {received}". */
  received: string;
  icon: string;
  /** Urgent signals surface at the top of the receiver's home screen. */
  urgent: boolean;
};

export const SIGNAL: Record<SignalKind, SignalMeta> = {
  miss_you: { action: 'I miss you', received: 'misses you', icon: '❤️', urgent: true },
  need_you: { action: 'I need you', received: 'needs you', icon: '❤️', urgent: true },
  want_to_see_you: {
    action: 'I want to see you',
    received: 'wants to see you',
    icon: '🤗',
    urgent: false,
  },
  call_me: { action: 'Call me', received: 'asked you to call', icon: '📞', urgent: true },
  thinking_of_you: {
    action: 'Thinking of you',
    received: 'is thinking about you',
    icon: '✦',
    urgent: false,
  },
  im_okay: { action: "I'm okay", received: 'let you know they are okay', icon: '☾', urgent: false },
};

export const ACK_TEXT = "I'm here ❤️";

/* ----------------------------------- goals --------------------------------- */

export const HORIZONS = [
  'now',
  'next_3_months',
  'this_year',
  'one_to_three_years',
  'future',
] as const;
export type Horizon = (typeof HORIZONS)[number];

export const HORIZON_LABEL: Record<Horizon, string> = {
  now: 'Now',
  next_3_months: 'Next 3 months',
  this_year: 'This year',
  one_to_three_years: '1–3 years',
  future: 'Future',
};

export const CATEGORIES = [
  'relationship',
  'home',
  'finance',
  'travel',
  'growth',
  'career',
  'experiences',
  'other',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY: Record<Category, { label: string; icon: string }> = {
  relationship: { label: 'Relationship', icon: '❤️' },
  home: { label: 'Home', icon: '🏠' },
  finance: { label: 'Finance', icon: '💰' },
  travel: { label: 'Travel', icon: '✈️' },
  growth: { label: 'Personal growth', icon: '🎓' },
  career: { label: 'Career', icon: '💼' },
  experiences: { label: 'Experiences', icon: '🎉' },
  other: { label: 'Other', icon: '🌱' },
};

export const GOAL_STATUSES = ['planned', 'active', 'done', 'paused'] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_STATUS_LABEL: Record<GoalStatus, string> = {
  planned: 'Planned',
  active: 'In progress',
  done: 'Done',
  paused: 'Paused',
};

/* ---------------------------------- sealed --------------------------------- */

export const SURPRISE_KINDS = ['message', 'activity', 'plan'] as const;
export type SurpriseKind = (typeof SURPRISE_KINDS)[number];

export const SURPRISE_KIND_LABEL: Record<SurpriseKind, string> = {
  message: 'A message',
  activity: 'An activity',
  plan: 'A plan',
};

/** Starting points offered when writing an Open When note. */
export const OPEN_WHEN_SUGGESTIONS = [
  'you miss me',
  "you're having a bad day",
  "you can't sleep",
  'you need a smile',
  'you want to feel close to me',
  "you're proud of yourself",
  "we've just argued",
] as const;

/* ------------------------------- notifications ----------------------------- */

export const NOTIFICATION_KINDS = [
  'signal',
  'signal_ack',
  'goal_completed',
  'goal_created',
  'plan_created',
  'plan_completed',
  'surprise_created',
  'surprise_opened',
  'open_when_created',
  'decision_created',
  'decision_made',
  'thought_added',
  'milestone_added',
  'month_updated',
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

/* --------------------------------- defaults -------------------------------- */

/** Seeded into `activities` the first time Pick for Us has nothing to draw. */
export const DEFAULT_ACTIVITIES = [
  'Go for a walk',
  'Have dinner together',
  'Watch a movie',
  'Call each other',
  'Plan our next date',
  'Ask each other a question',
  'Try somewhere new',
  'Spend an hour without phones',
] as const;

export const PRIORITY_ICONS = ['❤️', '💰', '🏠', '🎉', '✈️', '🎓', '💼', '🌱'] as const;

/* ---------------------------------- format --------------------------------- */

/** Fixed locale + UTC so the server and the phone never disagree. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m) return iso;
  const date = new Date(Date.UTC(y, m - 1, d || 1));
  return date.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    ...(d ? { day: 'numeric' } : {}),
    month: 'long',
    year: 'numeric',
  });
}

export function formatMonth(month: string): string {
  return formatDate(`${month}-01`).replace(/^\d+\s/, '');
}

/** "just now" / "12m ago" / "3h ago" / "Tuesday" / a date. */
export function timeAgo(ms: number, now = Date.now()): string {
  const diff = Math.max(0, now - ms);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function currentMonth(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
