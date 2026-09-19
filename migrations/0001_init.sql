-- Hajar & Salim — private couples platform.
-- Timestamps are epoch milliseconds (INTEGER). Dates the humans chose are
-- stored as ISO text ('YYYY-MM-DD' / 'YYYY-MM') so they never shift timezone.
--
-- There is deliberately no `relationships` table: the app seeds exactly two
-- accounts from environment variables and has no signup, so a couple id would
-- be a column with one value on every row. Partnership is modelled as
-- users.partner_id instead.

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id                  TEXT PRIMARY KEY,
  email               TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  partner_id          TEXT REFERENCES users(id),
  -- NULL until the account is claimed with the setup token.
  password_hash       TEXT,
  password_salt       TEXT,
  password_algo       TEXT,
  password_iterations INTEGER,
  claimed_at          INTEGER,
  created_at          INTEGER NOT NULL
);

CREATE TABLE sessions (
  -- id is sha256(token) as hex. The raw token only ever exists in the cookie,
  -- so a dump of this table cannot be replayed as a session.
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  user_agent   TEXT
);
CREATE INDEX sessions_user_idx    ON sessions(user_id);
CREATE INDEX sessions_expires_idx ON sessions(expires_at);

-- One row per attempt; windows are counted with a timestamp filter.
CREATE TABLE rate_limits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  bucket     TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX rate_limits_bucket_idx ON rate_limits(bucket, created_at);

-- Emotional signals. Intentionally no free-text body: a signal is an event,
-- not a message, and acknowledgement is a fixed gesture.
CREATE TABLE signals (
  id              TEXT PRIMARY KEY,
  from_user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL,
  created_at      INTEGER NOT NULL,
  acknowledged_at INTEGER
);
CREATE INDEX signals_to_idx      ON signals(to_user_id, created_at DESC);
CREATE INDEX signals_pending_idx ON signals(to_user_id, acknowledged_at);

CREATE TABLE goals (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT NOT NULL,
  horizon     TEXT NOT NULL,
  target_date TEXT,
  status      TEXT NOT NULL DEFAULT 'planned',
  progress    INTEGER NOT NULL DEFAULT 0,
  assigned_to TEXT NOT NULL DEFAULT 'both',
  created_by  TEXT NOT NULL REFERENCES users(id),
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  CHECK (progress BETWEEN 0 AND 100),
  CHECK (status IN ('planned','active','done','paused')),
  CHECK (horizon IN ('now','next_3_months','this_year','one_to_three_years','future'))
);
CREATE INDEX goals_horizon_idx ON goals(horizon, status);

CREATE TABLE plans (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  note       TEXT,
  done_at    INTEGER,
  done_by    TEXT REFERENCES users(id),
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX plans_done_idx ON plans(done_at, position);

CREATE TABLE activities (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  created_by  TEXT NOT NULL REFERENCES users(id),
  archived_at INTEGER,
  created_at  INTEGER NOT NULL
);

CREATE TABLE picks (
  id          TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  picked_by   TEXT NOT NULL REFERENCES users(id),
  created_at  INTEGER NOT NULL
);
CREATE INDEX picks_recent_idx ON picks(created_at DESC);

CREATE TABLE decisions (
  id         TEXT PRIMARY KEY,
  question   TEXT NOT NULL,
  context    TEXT,
  status     TEXT NOT NULL DEFAULT 'open',
  outcome    TEXT,
  decided_at INTEGER,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (status IN ('open','decided'))
);

CREATE TABLE decision_thoughts (
  id          TEXT PRIMARY KEY,
  decision_id TEXT NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  updated_at  INTEGER NOT NULL,
  UNIQUE (decision_id, user_id)
);

CREATE TABLE monthly_priorities (
  id         TEXT PRIMARY KEY,
  month      TEXT NOT NULL,
  label      TEXT NOT NULL,
  icon       TEXT,
  note       TEXT,
  done_at    INTEGER,
  position   INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL
);
CREATE INDEX monthly_priorities_month_idx ON monthly_priorities(month, position);

-- Sealed notes. The server never sends `body` to the recipient until the note
-- is opened; see lib/us/queries.ts.
CREATE TABLE open_when_notes (
  id           TEXT PRIMARY KEY,
  prompt       TEXT NOT NULL,
  body         TEXT NOT NULL,
  author_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unlock_at    INTEGER,
  opened_at    INTEGER,
  created_at   INTEGER NOT NULL
);
CREATE INDEX open_when_recipient_idx ON open_when_notes(recipient_id, opened_at);

CREATE TABLE surprises (
  id           TEXT PRIMARY KEY,
  number       INTEGER NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  kind         TEXT NOT NULL DEFAULT 'message',
  author_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unlock_at    INTEGER,
  opened_at    INTEGER,
  created_at   INTEGER NOT NULL,
  CHECK (kind IN ('message','activity','plan'))
);
CREATE INDEX surprises_recipient_idx ON surprises(recipient_id, opened_at);

CREATE TABLE timeline_events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  event_date  TEXT NOT NULL,
  description TEXT,
  created_by  TEXT NOT NULL REFERENCES users(id),
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX timeline_date_idx ON timeline_events(event_date DESC);

CREATE TABLE notifications (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  href       TEXT,
  ref_type   TEXT,
  ref_id     TEXT,
  read_at    INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX notifications_user_idx   ON notifications(user_id, created_at DESC);
CREATE INDEX notifications_unread_idx ON notifications(user_id, read_at);
