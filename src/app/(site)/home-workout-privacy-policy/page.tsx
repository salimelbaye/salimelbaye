import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { site } from '@/lib/site';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const APP_NAME = 'AI Workout Planner';
const PACKAGE = 'com.home.workout.planner';
const UPDATED = 'October 30, 2026';

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — Salim Elbaye" template:
  // this URL is registered in Google Play, where the app's own name is what
  // should read first.
  title: { absolute: `Privacy Policy — ${APP_NAME}` },
  description: `How ${APP_NAME} (${PACKAGE}) handles data. The app has no accounts and no backend. Ads are delivered through Unity LevelPlay with Unity Ads and Meta Audience Network; in the EEA, the UK and Switzerland they are enabled only after you allow them.`,
  alternates: { canonical: '/home-workout-privacy-policy' },
  openGraph: {
    type: 'article',
    url: `${site.url}/home-workout-privacy-policy`,
    title: `Privacy Policy — ${APP_NAME}`,
    description: `How ${APP_NAME} handles data, advertising and consent.`,
  },
  robots: { index: true, follow: true },
};

/* Local typographic primitives. The project has no prose plugin, so the page
   defines its own rhythm rather than pulling in a dependency for one route. */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 pt-2 text-[clamp(1.25rem,2.3vw,1.55rem)] font-semibold leading-[1.25] -tracking-[0.025em] text-ink"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[1.0rem] leading-[1.75] text-ink-muted">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2.5 pl-0">{children}</ul>;
}

function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-5 text-[0.97rem] leading-[1.7] text-ink-muted before:absolute before:left-0 before:top-[0.72em] before:h-1 before:w-1 before:rounded-full before:bg-accent-blue/70">
      {children}
    </li>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent-blue"
    >
      {children}
    </a>
  );
}

/** A section of the policy: heading plus its body, evenly spaced. */
function Clause({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line pt-9">
      <H2 id={id}>{title}</H2>
      {children}
    </section>
  );
}

const CLAUSES = [
  ['introduction', 'Introduction'],
  ['data-processed', 'Information that may be processed'],
  ['advertising', 'Advertising partners'],
  ['ad-formats', 'Rewarded and interstitial advertisements'],
  ['consent', 'Consent and your privacy choices'],
  ['use', 'How information is used'],
  ['third-parties', 'Third-party services'],
  ['retention', 'Data retention'],
  ['children', "Children's privacy"],
  ['security', 'Security'],
  ['rights', 'Your privacy rights'],
  ['changes', 'Changes to this Privacy Policy'],
  ['contact', 'Contact'],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <div className="relative py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-[72ch]">
          {/* --- header --- */}
          <Link
            href="/"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-10 w-fit')}
          >
            <ArrowLeft aria-hidden />
            Back to home
          </Link>

          <header className="flex flex-col gap-5">
            <span className="eyebrow">Legal · Mobile app</span>
            <h1 className="text-[clamp(2rem,4.6vw,2.9rem)] font-bold leading-[1.08] -tracking-[0.04em]">
              <span className="headline-gradient">Privacy Policy</span>
            </h1>
            <p className="text-[1.06rem] leading-[1.7] text-ink-muted">
              This policy explains how the {APP_NAME} Android application handles information. It
              is written to describe what the app actually does, rather than to cover every
              possibility in the abstract.
            </p>

            <dl className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line surface-card sm:grid-cols-3">
              {[
                ['Application', APP_NAME],
                ['Android package', PACKAGE],
                ['Last updated', UPDATED],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 p-4 sm:p-5">
                  <dt className="font-mono text-[10.5px] uppercase tracking-label text-ink-dim">
                    {label}
                  </dt>
                  <dd className="break-words font-mono text-[13px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </header>

          {/* --- contents --- */}
          <nav aria-label="On this page" className="mt-12 rounded-xl border border-line p-5 sm:p-6">
            <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-dim">
              On this page
            </p>
            <ol className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {CLAUSES.map(([id, title], i) => (
                <li key={id} className="flex gap-3 text-[14px]">
                  <span className="font-mono text-ink-dim">{String(i + 1).padStart(2, '0')}</span>
                  <a
                    href={`#${id}`}
                    className="text-ink-muted transition-colors hover:text-ink"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* --- body --- */}
          <div className="mt-12 flex flex-col gap-9">
            <Clause id="introduction" title="1. Introduction">
              <P>
                {APP_NAME} is a home fitness application for Android, published under the package
                name <span className="font-mono text-[0.92em] text-ink">{PACKAGE}</span>. It guides
                bodyweight workouts on your device. It has no user accounts, no sign-in, and no
                server operated by the developer.
              </P>
              <P>
                The app is free and is supported by advertising. The advertising software built
                into the app connects to the advertising partners described in{' '}
                <a href="#advertising" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 3
                </a>
                . That connection is the only reason the app uses the internet, and it is the main
                subject of this policy.
              </P>
              <P>
                This document describes the developer&apos;s own practices and what the app does. It
                is provided for transparency and is not legal advice, and it does not by itself
                establish compliance with any particular law.
              </P>
            </Clause>

            <Clause id="data-processed" title="2. Information that may be processed">
              <P>
                <strong className="font-medium text-ink">
                  The developer does not operate a backend and does not collect personal
                  information from you directly.
                </strong>{' '}
                The app&apos;s own code sends nothing over the internet; all of its network
                traffic comes from the advertising software described below.
              </P>
              <P>Information the app creates stays on your device. That includes:</P>
              <UL>
                <LI>
                  Your completed workout history, streaks and totals, including the calorie
                  estimate for each session.
                </LI>
                <LI>
                  Preferences you set — body weight, units, theme, sound, voice guidance, reminder
                  time and similar settings.
                </LI>
                <LI>
                  Your advertising choice, if the app asked you for one (see{' '}
                  <a href="#consent" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                    section 5
                  </a>
                  ).
                </LI>
              </UL>
              <P>
                Clearing your workout history in Settings deletes your logged sessions.
                Uninstalling the app, or clearing its storage in your Android settings, removes
                everything the app has stored. If backup is turned on for your device, Android may
                include this app&apos;s data in the backup kept in your own Google account; the
                developer has no access to that backup.
              </P>
              <P>
                To decide whether to ask for your advertising choice, the app checks the country of
                your SIM card or mobile network or, if neither is available, your device&apos;s
                region setting. This check runs on your device, needs no permission, and its result
                is not sent anywhere by the app.
              </P>
              <P>
                <strong className="font-medium text-ink">Advertising is different.</strong> When
                advertising is enabled, the advertising partners&apos; software collects
                information from your device and shares it with those partners, who use it to
                select, deliver and measure ads. According to the partners&apos; own published
                disclosures, this includes:
              </P>
              <UL>
                <LI>
                  <strong className="font-medium text-ink">Device and advertising identifiers</strong>{' '}
                  — your Android advertising ID and app set ID, and other identifiers the partners
                  associate with your device or with this installation of the app.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">IP address and approximate location</strong>{' '}
                  — such as your country or city. The app does not request access to your
                  device&apos;s location, so neither the app nor the advertising software can read
                  your precise (GPS) location.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">Device information</strong> — such as
                  your device model, operating system, screen size and the versions of the
                  advertising software.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">Ad interactions</strong> — which ads are
                  shown, how they are viewed, whether you tap them, and whether a rewarded video is
                  watched to the end.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">Diagnostics</strong> — technical and
                  performance information about the ads and the advertising software.
                </LI>
              </UL>
              <P>
                The advertising software also declares permission to use Android&apos;s Privacy
                Sandbox advertising features (Topics and Attribution) on devices that support them.
                You can manage these in your device&apos;s ad privacy settings.
              </P>
              <P>
                The developer does not receive this information in an identifiable form. Each
                partner processes it under its own privacy policy, linked in{' '}
                <a href="#advertising" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 3
                </a>
                .
              </P>
            </Clause>

            <Clause id="advertising" title="3. Advertising partners">
              <P>Ads in the app are delivered through three components:</P>
              <UL>
                <LI>
                  <strong className="font-medium text-ink">Unity LevelPlay</strong> (Unity) — an
                  advertising mediation platform. When the app needs an ad, LevelPlay chooses which
                  ad network supplies it.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">Unity Ads</strong> (Unity) — an
                  advertising network.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">Meta Audience Network</strong> (Meta) —
                  an advertising network.
                </LI>
              </UL>
              <P>
                Each is a third party. Its software runs inside the app, receives the information
                described in{' '}
                <a href="#data-processed" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 2
                </a>
                , and uses it under its own policies, which the developer does not control.
              </P>
              <P>The partners&apos; official information:</P>
              <UL>
                <LI>
                  <A href="https://unity.com/legal/game-player-and-app-user-privacy-policy">
                    Unity Game Player and App User Privacy Policy
                  </A>{' '}
                  — covers Unity LevelPlay and Unity Ads
                </LI>
                <LI>
                  <A href="https://www.facebook.com/privacy/policy/">Meta Privacy Policy</A>
                </LI>
                <LI>
                  <A href="https://developers.facebook.com/docs/audience-network">
                    Meta Audience Network documentation
                  </A>
                </LI>
              </UL>
              <P>
                No advertisement is requested until advertising has been enabled. See{' '}
                <a href="#consent" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 5
                </a>
                .
              </P>
            </Clause>

            <Clause id="ad-formats" title="4. Rewarded and interstitial advertisements">
              <P>
                The app uses exactly two ad formats.{' '}
                <strong className="font-medium text-ink">There are no banner advertisements</strong>,
                and no ad is ever displayed during an exercise or during a rest period.
              </P>
              <P>
                Once advertising is enabled, the app requests advertisements in advance so that one
                is ready when needed. Requesting an advertisement shares information described in{' '}
                <a href="#data-processed" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 2
                </a>
                , such as identifiers and device information, even if the advertisement is never
                shown.
              </P>

              <div className="flex flex-col gap-4 rounded-xl border border-line surface-card p-5 sm:p-6">
                <h3 className="text-[15px] font-semibold text-ink">Interstitial advertisements</h3>
                <UL>
                  <LI>Shown when you start a free workout, before the session begins.</LI>
                  <LI>
                    Shown after every third exercise you open from the exercise library, as you
                    close it. Only exercises opened from the library are counted, and the count
                    starts again each time the app is restarted.
                  </LI>
                  <LI>
                    Never shown during a workout, and never when you start a premium workout.
                  </LI>
                  <LI>
                    If no advertisement is ready, or one fails to load or display, your workout
                    starts, or you carry on, as normal.
                  </LI>
                </UL>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-line surface-card p-5 sm:p-6">
                <h3 className="text-[15px] font-semibold text-ink">Rewarded advertisements</h3>
                <UL>
                  <LI>
                    Always started by you. A rewarded advertisement is shown only when you tap{' '}
                    <strong className="font-medium text-ink">Watch ad &amp; start workout</strong>{' '}
                    on a premium workout.
                  </LI>
                  <LI>
                    Watching one in full unlocks that premium workout for a single session. Nothing
                    is purchased and no payment is involved.
                  </LI>
                  <LI>
                    The reward is granted only when the advertising partner confirms the
                    advertisement was completed. Closing it early grants nothing.
                  </LI>
                  <LI>
                    If the advertisement fails to load, fails to display, or no advertisement is
                    available, nothing is granted and the app continues to work normally.
                  </LI>
                  <LI>
                    The unlock is not stored. It applies to that session only and is not retained
                    after it ends or after the app is closed, so it grants no lasting entitlement.
                  </LI>
                </UL>
              </div>

              <P>
                The entire free workout library is available without watching any rewarded
                advertisement.
              </P>
            </Clause>

            <Clause id="consent" title="5. Consent and your privacy choices">
              <P>
                Whether the app asks before enabling advertising depends on the country check
                described in{' '}
                <a href="#data-processed" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 2
                </a>
                .
              </P>
              <P>
                <strong className="font-medium text-ink">
                  If that check indicates a country in the European Economic Area, the United
                  Kingdom or Switzerland — or if no country can be determined —
                </strong>{' '}
                the app asks you before enabling advertising:
              </P>
              <UL>
                <LI>
                  Until you answer, the app does not start Unity LevelPlay, and no advertisement is
                  requested or shown.
                </LI>
                <LI>
                  If you choose <strong className="font-medium text-ink">Allow ads</strong>,
                  advertising is enabled.
                </LI>
                <LI>
                  If you choose <strong className="font-medium text-ink">No thanks</strong>, the
                  app does not start Unity LevelPlay and no advertisement is requested or shown.
                  The free workout library and the rest of the app remain available; premium
                  workouts cannot be unlocked while advertising is off, because each premium
                  session is unlocked by a rewarded advertisement.
                </LI>
                <LI>
                  If you close the question without answering, nothing is enabled, and you are
                  asked again the next time the app starts.
                </LI>
                <LI>
                  Your answer is stored on your device. You can change it at any time in{' '}
                  <strong className="font-medium text-ink">Settings → Privacy choices</strong>.
                  Withdrawing consent stops all advertising requests and discards any advertisement
                  already loaded; from the next time the app starts, Unity LevelPlay is not started
                  at all.
                </LI>
              </UL>
              <P>
                <strong className="font-medium text-ink">Everywhere else,</strong> advertising is
                enabled when the app starts, without a question, and the Privacy choices setting is
                not shown.
              </P>
              <P>
                When advertising is enabled, the app informs Unity LevelPlay that advertising is
                permitted before starting it.
              </P>
              <P>
                Wherever you are, you can limit ad personalisation through your device. On Android
                this is normally under Settings → Google → Ads, or Settings → Privacy → Ads, where
                you can reset or delete your advertising ID. These controls are provided by your
                device and apply across apps.
              </P>
            </Clause>

            <Clause id="use" title="6. How information is used">
              <P>Information is used only for these purposes:</P>
              <UL>
                <LI>
                  <strong className="font-medium text-ink">Running the app.</strong> Your workout
                  history and preferences are used on your device to show progress, estimate
                  calories from the body weight you enter, and run reminders you enable.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">Serving advertising.</strong> The
                  advertising partners use the information described in{' '}
                  <a href="#data-processed" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                    section 2
                  </a>{' '}
                  to select and display ads, including personalised ads where permitted; to measure
                  and report on ad delivery and performance; to operate their advertising software;
                  and to detect fraud and invalid activity, keep their services secure and meet
                  their legal obligations.
                </LI>
              </UL>
              <P>
                The developer does not receive the advertising partners&apos; data in an
                identifiable form and does not itself build advertising or marketing profiles about
                you. The developer sees only aggregated reports from the advertising platforms,
                such as the number of ads shown and the revenue earned.
              </P>
            </Clause>

            <Clause id="third-parties" title="7. Third-party services">
              <P>
                Three third-party advertising components are embedded in the app:{' '}
                <strong className="font-medium text-ink">Unity LevelPlay</strong>,{' '}
                <strong className="font-medium text-ink">Unity Ads</strong> and{' '}
                <strong className="font-medium text-ink">Meta Audience Network</strong>, described
                in{' '}
                <a href="#advertising" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 3
                </a>
                . The advertising software also uses Google Play services components to read your
                advertising ID and app set ID on your device.
              </P>
              <P>
                There is no analytics service and no crash-reporting service in this release, and
                no advertising network other than those listed — for example, Google AdMob is not
                used.
              </P>
              <P>
                Settings also contains links to this policy and to another app by the same
                developer on Google Play. They open in your browser or the Google Play app, and the
                app adds no information about you to them.
              </P>
              <P>
                Distribution through Google Play is also subject to Google&apos;s own policies,
                which apply independently of this document.
              </P>
            </Clause>

            <Clause id="retention" title="8. Data retention">
              <P>
                Workout history and preferences are kept on your device until you delete them.
                Clearing your workout history in Settings removes the stored sessions, and
                uninstalling the app removes all of the app&apos;s local data. Your advertising
                choice, where one was asked for, is kept on your device until you change it or
                remove the app&apos;s data.
              </P>
              <P>
                A premium workout unlock earned from a rewarded advertisement is held in memory only
                and is not written to storage, so it does not survive the session.
              </P>
              <P>
                The developer retains no personal information, because none is sent to the
                developer. How long the advertising partners keep the information they collect is
                decided by each partner under its own policy.
              </P>
            </Clause>

            <Clause id="children" title="9. Children's privacy">
              <P>
                {APP_NAME} is intended for a general audience and is not directed to children. The
                developer does not knowingly collect personal information from children. If you
                believe a child has provided information through this app, please get in touch using
                the contact details below.
              </P>
            </Clause>

            <Clause id="security" title="10. Security">
              <P>
                Because the app stores its own data locally and operates no backend, the security
                of that data rests largely on your device — its lock screen, encryption and
                operating system updates.
              </P>
              <P>
                Network communication for advertising is handled by the advertising partners&apos;
                software. Unity states that data collected by Unity LevelPlay and Unity Ads is
                encrypted in transit, and the app does not relax Android&apos;s default settings,
                which block unencrypted network connections. No method of transmission or storage
                is completely secure, and no absolute guarantee of security can be given.
              </P>
            </Clause>

            <Clause id="rights" title="11. Your privacy rights">
              <P>
                Depending on where you live, you may have rights over your personal information,
                such as access, correction, deletion, or objecting to certain processing.
              </P>
              <P>
                <strong className="font-medium text-ink">
                  To request deletion of your data, or to make any other privacy request, email{' '}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue"
                  >
                    {site.email}
                  </a>
                  .
                </strong>{' '}
                The developer holds no personal information about you, so requests about
                advertising data will be forwarded to the relevant partner — Unity or Meta — and
                you will be told how to contact them directly.
              </P>
              <P>You can also act directly:</P>
              <UL>
                <LI>
                  <strong className="font-medium text-ink">On your device:</strong> clearing your
                  workout history or uninstalling the app removes the app&apos;s local data, and you
                  can reset or delete your advertising ID in your device settings.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">In the app:</strong> where the app asked
                  for your advertising choice, you can change it at any time in Settings → Privacy
                  choices.
                </LI>
                <LI>
                  <strong className="font-medium text-ink">With the partners:</strong> Unity
                  explains how to opt out of personalised ads and request deletion of data in its
                  Game Player and App User Privacy Policy, and Meta describes its controls in the
                  Meta Privacy Policy. Both are linked in{' '}
                  <a href="#advertising" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                    section 3
                  </a>
                  .
                </LI>
              </UL>
            </Clause>

            <Clause id="changes" title="12. Changes to this Privacy Policy">
              <P>
                This policy may be updated as the app changes — for example if an advertising
                partner is added or replaced, or if the consent process changes. The date at the
                top of this page shows when it was last revised.
              </P>
              <P>
                Material changes will be reflected here before or at the time the corresponding app
                update is released. Continuing to use the app after an update means the revised
                policy applies.
              </P>
            </Clause>

            <Clause id="contact" title="13. Contact">
              <P>
                For any question about this policy or about privacy in {APP_NAME}, including data
                deletion requests, please get in touch.
              </P>
              <div className="flex flex-col gap-2 rounded-xl border border-line surface-card p-5 sm:p-6">
                <span className="text-[15px] font-semibold text-ink">{site.name}</span>
                <span className="text-[0.95rem] text-ink-muted">Developer of {APP_NAME}</span>
                <a
                  href={`mailto:${site.email}`}
                  className="w-fit font-mono text-[13.5px] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent-blue"
                >
                  {site.email}
                </a>
              </div>
            </Clause>
          </div>

          <p className="mt-12 border-t border-line pt-8 font-mono text-[12px] text-ink-dim">
            Last updated: {UPDATED}
          </p>
        </div>
      </div>
    </div>
  );
}
