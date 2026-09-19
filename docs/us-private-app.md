# `/us` — Hajar & Salim

A private, two-person app living inside this site at `salimelbaye.com/us`. It shares the
repository, the build and the deploy with the public portfolio, and nothing else: its own
layout, its own theme, its own database tables, its own session cookie.

Written for whoever maintains this next — most likely Salim, months from now.

---

## What it is

Nine features, all built around the idea that the app should be useful on an ordinary
Tuesday, not just on an anniversary:

| Route | What it does |
| --- | --- |
| `/us` | Dashboard: waiting signals, "How are we?", quick signals, next dated goal, this month, upcoming goals |
| `/us/signals` | Send and answer emotional signals. Events, never a chat thread |
| `/us/together` | Hub for the four "Us" sections |
| `/us/story` | Text timeline of milestones |
| `/us/life-plan` | Shared goals grouped Now → Next 3 months → This year → 1–3 years → Future |
| `/us/decisions` | A question, each person's own thoughts, then one shared decision |
| `/us/plans` | Checklist of things to do together |
| `/us/pick` | Draws a random activity, avoiding the last three |
| `/us/this-month` | Up to five priorities for the current month |
| `/us/surprises` | Sealed surprises, numbered, optionally date-locked |
| `/us/open-when` | Sealed notes for a specific moment |
| `/us/notifications` | In-app notification feed |
| `/us/more` | Account, password change, sign out |

No photo gallery, no feed, no chat — by design.

## Architecture

- **Runtime** — the same Next.js 15 app as the public site, deployed to Cloudflare Workers
  via `@opennextjs/cloudflare`.
- **Database** — Cloudflare D1, bound as `DB`. Schema in `migrations/`.
- **Isolation** — public pages live in the `(site)` route group and keep the portfolio
  header/footer; `/us` has its own layout and theme and inherits none of it. URLs for the
  public site are unchanged.
- **No new runtime dependencies.** Auth is built on Web Crypto, the UI on the React,
  Tailwind, framer-motion and lucide already in the project. `wrangler`,
  `@opennextjs/cloudflare` and `server-only` are dev/build-time only.

### Files

```
migrations/0001_init.sql          schema (15 tables)
src/middleware.ts                 fast cookie-presence redirect (NOT the security boundary)
src/lib/us/
  env.ts        D1 + secrets accessors          crypto.ts    PBKDF2, tokens, constant-time compare
  session.ts    session create/read/destroy     auth.ts      sign in, claim, change password, requireUser
  rate-limit.ts D1-backed fixed window          validate.ts  server-side input validators
  queries.ts    every read, incl. seal()        notify.ts    notification writer
  model.ts      shared vocabulary (client-safe) actions/*    server actions, one file per domain
src/app/us/                       routes: (auth) public, (app) authenticated
src/components/us/                shell, nav, forms, signal buttons
public/us/                        home-screen icons (regenerate: node scripts/make-us-icons.mjs public/us)
```

## Security model

The claims below are the ones the code actually makes good on.

- **Two accounts, no signup.** `bootstrapUsers()` seeds exactly two rows from environment
  variables. There is no route that creates a user.
- **Claiming.** Accounts start with no password. Each person claims theirs once at
  `/us/claim` using `SETUP_TOKEN` (a Cloudflare secret). The claim is guarded by both an
  application check and `WHERE claimed_at IS NULL`, so a second claim is a no-op, not a race.
- **Passwords.** PBKDF2-HMAC-SHA256, 600,000 iterations, 128-bit random per-user salt,
  256-bit output. The iteration count is stored per user so it can be raised later without
  invalidating existing passwords. Compared in constant time. Never stored or logged in
  clear. A password is stored verbatim and verified verbatim — no trimming on either side.
- **Sessions.** 256-bit random token in an `HttpOnly; Secure; SameSite=Lax; Path=/us`
  cookie. Only `sha256(token)` is stored, so a database dump cannot be replayed as a
  session. Expiry is enforced in SQL. Changing a password destroys every session on every
  device, then reissues one.
- **Authorization.** `requireUser()` is the boundary. Every page and all 31 server actions
  call it first. `middleware.ts` only does a cheap cookie-presence redirect and is never
  relied on — a forged cookie passes middleware and is then rejected by the session lookup.
- **Ownership is in SQL, not in the UI.** Acknowledging a signal is
  `WHERE ... AND to_user_id = ?`; opening a sealed item is
  `WHERE ... AND recipient_id = ? AND opened_at IS NULL AND (unlock_at IS NULL OR unlock_at <= ?)`.
- **Sealed content never leaves the server early.** `seal()` in `queries.ts` strips `body`
  unless the reader is the author, or is the recipient *and* has opened it *and* the unlock
  time has passed. The unlock time is enforced twice: in the `UPDATE` that opens the row,
  and again at render. No sealed row is ever passed into a client component, so it cannot
  leak through the RSC payload either.
- **CSRF.** All mutations are Server Actions; Next validates `Origin` against `Host` before
  the action body runs. Verified: a cross-origin submission with a valid cookie is refused.
- **XSS.** No `dangerouslySetInnerHTML` anywhere under `/us`. All text is React-escaped.
- **SQL injection.** Every statement uses bound parameters. The one dynamically built
  fragment (`pick.ts`) interpolates only `?1,?2,?3` placeholders derived from array indices.
- **Input validation.** Server-side, on every field, in `validate.ts`. Categories, horizons,
  statuses and signal kinds are checked against allow-lists; `assigned_to` must be `both` or
  one of the two real account ids.
- **Rate limits.** Sign-in (8 per account / 20 per IP per 15 min), claim (10/hour),
  password change (5/15 min), signals (30/hour). Backed by D1, swept on write.
- **Not indexed, not cached, not framed.** `/us/*` sends
  `X-Robots-Tag: noindex, nofollow, noarchive`, `Cache-Control: no-store`,
  `X-Frame-Options: DENY` and a CSP with `frame-ancestors 'none'`. `robots.ts` disallows
  `/us` and the sitemap does not mention it.
- **Secrets** live in Cloudflare, never in the repo. `.dev.vars` is git-ignored.

### Known limits — read these

- **Workers Paid is required.** One password verification costs roughly 0.5 s of CPU. That
  fits the Paid plan's 30 s per-request limit but not the Free plan's 10 ms. On Free, sign-in
  will fail. If you ever need to run on Free, lower `PBKDF2_ITERATIONS` in
  `src/lib/us/crypto.ts` — and understand that you are weakening the hash to do it.
- **PBKDF2, not Argon2id.** Argon2id is the better algorithm, but it needs WASM on Workers.
  PBKDF2 at 600k is the strongest thing available here with zero dependencies.
- **The minimum password length is 11, not 12.** It was lowered on purpose so the chosen
  initial password would be accepted, and both accounts currently share that password. That
  means either person can sign in as the other, and the password is guessable from the two
  names. Raise `MIN_PASSWORD_LENGTH` in `src/lib/us/model.ts` back to 12+ and set a separate
  password per person from `/us/more` when convenient; existing hashes are unaffected by
  changing the constant.
- **No HSTS header is set by this app.** Enable HSTS in the Cloudflare dashboard (SSL/TLS →
  Edge Certificates) if you want it; it belongs at the edge, for the whole domain.
- **No browser push yet.** Notifications are in-app. Real iOS push needs the app installed
  to the home screen (iOS 16.4+) plus VAPID Web Push — doable with Web Crypto and no new
  dependency, but not built.
- **`unlock_at` is a date, interpreted as 00:00 UTC.** Morocco is UTC+1, so a note unlocks
  at 01:00 local on the chosen day.

## First-time setup

Steps 1–4 happen once, in the Cloudflare account that owns the site.

**1. Create the database**

```bash
npx wrangler d1 create hajar-salim
```

Copy the printed `database_id` into `wrangler.jsonc`, replacing
`PLACEHOLDER_RUN_WRANGLER_D1_CREATE`. It is not a secret.

**2. Confirm the Worker name**

```bash
npx wrangler deployments list
```

The `name` in `wrangler.jsonc` **must** match the Worker already serving salimelbaye.com.
A mismatch creates a second Worker and leaves the live site on the old one.

**3. Set the secrets**

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"   # setup token

npx wrangler secret put SETUP_TOKEN
npx wrangler secret put PARTNER_A_NAME     # Salim
npx wrangler secret put PARTNER_A_EMAIL
npx wrangler secret put PARTNER_B_NAME     # Hajar
npx wrangler secret put PARTNER_B_EMAIL
```

Only `SETUP_TOKEN` is truly secret; the others are kept out of the repo for privacy.
Existing secrets on the Worker (for example `GITHUB_TOKEN`) are untouched by a deploy.

**4. Apply the schema to the real database**

```bash
npx wrangler d1 execute hajar-salim --remote --file=./migrations/0001_init.sql
```

**5. Deploy**

```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

If the Cloudflare dashboard currently builds this repo automatically, set its build command
to `npx opennextjs-cloudflare build` so it uses the config now committed here rather than an
inferred one.

**6. Claim the two accounts**

Each person opens `https://salimelbaye.com/us/claim`, enters their email and the setup
token, and chooses a password. Let the iPhone generate and save it — it will then be a Face
ID autofill from then on. After both accounts are claimed the page refuses to create any
more access.

**7. Add to the Home Screen**

Safari → Share → Add to Home Screen. It opens full-screen, without browser chrome, and is
where push notifications would later arrive.

## Local development

```bash
cp .dev.vars.example .dev.vars          # then edit; it is git-ignored
npx wrangler d1 execute hajar-salim --local --file=./migrations/0001_init.sql
npm run dev
```

`next dev` picks up the local D1 and `.dev.vars` through
`initOpenNextCloudflareForDev()` in `next.config.mjs`.

To exercise the real Workers runtime instead of the Node dev server:

```bash
npx opennextjs-cloudflare build
npx opennextjs-cloudflare preview --port 8788
```

Note that over plain `http://localhost` the production build sets `Secure` on the session
cookie, so a browser will drop it; use `npm run dev` for interactive work and the preview
for verifying runtime behaviour.

## Changing the schema

Add a new numbered file in `migrations/` — never edit `0001_init.sql`, it has already run.
Apply it with `--local` first, then `--remote`. Re-run `npx wrangler types` after changing
bindings in `wrangler.jsonc`.
