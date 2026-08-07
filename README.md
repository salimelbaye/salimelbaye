# salimelbaye.com

Personal site of Salim Elbaye — software engineer, SaaS founder, AI automation developer.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui conventions · Framer Motion · Lucide Icons

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Where to edit things

| What | Where |
| --- | --- |
| All copy, projects, stats, timeline, posts | `src/lib/site.ts` |
| Structured data (JSON-LD) | `src/lib/schema.ts` |
| Continent outlines for the world map | `src/lib/geo.ts` |
| Colours, type scale, shadows | `tailwind.config.ts` |
| Base styles and component classes | `src/app/globals.css` |
| Page composition | `src/app/page.tsx` |

Sections live in `src/components/sections/` and read from `site.ts`, so adding a
project or a post is a one-line change to the data — never a component edit.

## Before you deploy

1. Replace `site.url`, `site.email` and the social links in `src/lib/site.ts`.
2. Add `public/og.png` at 1200×630 for OpenGraph and Twitter cards.
3. Add a favicon set to `src/app/` (`icon.png`, `apple-icon.png`).
4. Build the `/resume` and `/blog` routes, or point those nav links elsewhere.
5. `npm run build` and check Lighthouse.

## Notes on the design

The signature element is the world dot-map in the Google Maps Data Platform card
(`src/components/shared/world-dot-map.tsx`). It renders on the server from the
polygons in `geo.ts`, so it ships as static SVG: no client JS, no layout shift.
The dot scatter is deterministic rather than random so the server and client
markup always match.

Motion is deliberately restrained — one scroll reveal, one counter, one ripple on
the map pins. Everything respects `prefers-reduced-motion`.

---

## v2 changes

The page is now ordered as an argument, not a list: **who → proof → flagship →
supporting work → toolkit → code → story → thinking → credentials → contact.**

New sections live in `src/components/sections/`: `flagship.tsx`, `tech-stack.tsx`,
`github.tsx`, `notes.tsx`, `resume.tsx`. New shared pieces: `product-screen.tsx`
(the laptop rendering the live product UI), `architecture-diagram.tsx`,
`scroll-progress.tsx`.

### GitHub — read this before deploying

`src/lib/github.ts` fetches real data and **never fabricates any**:

- **Repositories** use the public REST API. No token required.
- **Contribution calendar and streaks** require a token, because the REST API
  does not expose contributions — only GraphQL does.

```bash
# .env.local — a classic PAT with no scopes is enough for public data
GITHUB_TOKEN=ghp_xxx
```

Set your handle in `github.username` in `src/lib/site.ts`. If a fetch fails or the
token is missing, the section degrades to a plain profile link rather than showing
invented numbers. A contribution graph that doesn't match your real profile is
worse than no graph — recruiters click through.

### Placeholders that must be replaced

Everything below is invented to demonstrate the design. Search for `TODO(salim)`.

| Where | What |
| --- | --- |
| `stats` | All six figures |
| `flagship.impact` | 100K+, 40+, 98%, 6h→4m |
| `flagship.problems` | The 1-in-5 → 1-in-50 claim |
| `projects` | 500 names/sweep, <3s latency |
| `notes` | All three notes and their metrics |
| `resume.education` / `.certifications` | Render as visible dashed markers until filled |
| `resume.languages` | Confirm your real CEFR levels |
| `resume.cvUrl` | Add `public/salim-elbaye-cv.pdf` |

The resume placeholders are deliberately rendered as dashed `add degree` chips so
incomplete data is visible in the UI and cannot ship unnoticed.

## v3 changes

- **Title** is now `Software Engineer | AI, Automation & Cybersecurity` (`site.role`).
- **Hero** is portrait-led. The image is feathered into the page by
  `.portrait-feather` in `globals.css` — two masks intersected, because a single
  radial gradient cannot reach full transparency at the box corners and leaves a
  visible hard edge. Depth comes from three offset blurred glows plus a faint arc.
- **Work** is product-led. The problems list, architecture diagram and rationale
  blocks are gone; `product-window.tsx` shows the running dashboard instead, with
  four icon-led impact cards beneath it.
- **Tech Stack section removed** entirely, along with `tech-icons.json`,
  `alsoUsing`, and the nav entry. The `18 Technologies` stat was removed too — it
  was only supported by that section.
- **Real links** everywhere: `github.com/salimelbaye`, the real LinkedIn URL, and
  `contact@salimelbaye.com`.
- **Location line** replaced by `site.positioning`.

### Open item: the cybersecurity claim

The title now says Cybersecurity, but nothing on the page evidences it — no
security project, no security note, and `resume.certifications` is still an empty
placeholder. Close that gap before publishing, either by adding a security-focused
entry to `projects`/`notes` or by filling in a certification. If you would rather
match the title to the current evidence, change `site.role` to:

```ts
role: 'Software Engineer | AI, Automation & Data Platforms',
```

---

## v4 — final polish

- **Hero now shows both**: the large feathered portrait *and* the MacBook running
  the product. `laptop.tsx` wraps `dashboard.tsx`; the portrait sits behind at 86%
  width, the laptop overlaps its lower third at 76%.
- **Dashboard** is a full SaaS surface: icon rail, ⌘K search, gradient Export
  button, avatar, three KPI cards (one with a sparkline), glowing progress bar,
  and a results table with verification badges. Same component is reused in Work,
  so the flagship reads as one coherent product.
- **Currently building** moved out of the hero visual into a pill strip in the copy
  column, so the right side stays clean.
- **Icons** use Lucide outlines stroked with the `#icg` gradient defined once in
  `layout.tsx`.
- **Role**: `Software Engineer • AI Automation • Cybersecurity`.
- **Primary CTA**: View Projects. Secondary: Resume.

### A note on `twitter:` metadata

There is no Twitter/X link anywhere on the site — only GitHub, LinkedIn and email.
The `twitter:card` tags in `layout.tsx` are link-preview metadata used by X,
LinkedIn, Slack and iMessage to render a rich card when someone shares the URL.
Removing them would degrade every shared link, so they stay.

### Portrait

`public/salim-elbaye.jpg` is a wider crop (more shoulder in frame) with a
cinematic grade: raised contrast, cooled shadows, and a soft vignette. The face
is untouched — no warping or reshaping, which is what makes portraits read as
AI-generated. If you want genuinely broader shoulders, that is a camera and
lighting decision, not a post decision.

---

## v5 — hero recomposition

Reading order is now Face → Headline → Laptop → CTA.

- **Portrait is the hero**: full column width (was 86%), face fully clear, laptop
  moved down to `left-[19%] bottom-0 w-[60%]` so it sits below the shoulder line
  and overlaps only the darkened base of the frame.
- **The photo's own MacBook was removed.** It sat directly behind the rendered one
  and read as two competing laptops. The portrait build script fades the image to
  the page background between 47% and 62% height, so the figure dissolves into
  darkness and only one laptop is visible. Face and torso are untouched.
- **The dashboard is now resolution-independent.** Every dimension derives from
  `--u: 0.228cqw` (a container-relative unit) in `globals.css`, so the laptop can
  be resized freely without the interface clipping or reflowing. This is why the
  dashboard styles live in `globals.css` rather than as Tailwind arbitrary values.
- **Blue glow** sits behind the laptop via the `glow` prop on `<Laptop />`
  (enabled in the hero, disabled in Work where the section already glows).
- The name is `whitespace-nowrap` at a reduced clamp so it never wraps.

### Regenerating the portrait

The processing chain is: crop → contrast/colour → cool shadows → vignette →
bottom fade-to-background. If you shoot a new photo without a laptop in frame,
drop the final fade step.

---

## v6 — full-bleed hero

Matches the supplied reference: the portrait now runs to the **right edge of the
viewport** and the full height of the hero, instead of sitting inside a grid column.

- `.hero` is `relative` + `min-h-[850px]`; the photo is absolutely positioned at
  `inset-y-0 right-0 w-[56%]` with `object-cover`.
- `.hero-photo-mask` (globals.css) feathers the **left** edge only, so the photo
  dissolves into the page rather than ending on a hard line.
- The copy column is capped at `max-w-[560px]` so the laptop never overlaps the
  social icons.
- The laptop is anchored at `bottom-0 left-1/2 w-[30%]`.
- Photo and laptop come **after** the copy in the DOM, so mobile stacks
  copy → photo → laptop; `max-lg:` variants turn both back into flow elements.

### Source crop

`public/salim-elbaye.jpg` is cropped to `(240, 0, 1090, 1045)` of the original.
That window deliberately excludes the wall poster on the right — `object-position`
could not remove it, because the photo is narrower in aspect than its box, so the
browser only ever crops vertically. Anything you want out of frame has to leave
the source crop.
