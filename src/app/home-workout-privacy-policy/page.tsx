import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { site } from '@/lib/site';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const APP_NAME = 'Home Workout Planner';
const PACKAGE = 'com.home.workout.planner';
const UPDATED = 'August 28, 2026';

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s — Salim Elbaye" template:
  // this URL is registered in Google Play, where the app's own name is what
  // should read first.
  title: { absolute: `Privacy Policy — ${APP_NAME}` },
  description: `How ${APP_NAME} (${PACKAGE}) handles data. The app has no accounts and no backend. Meta Audience Network is the only advertising provider, and no advertisements are served while no consent platform is connected.`,
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
  ['advertising', 'Advertising and Meta Audience Network'],
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
                Because the app is supported by advertising rather than payment, it connects to a
                third-party advertising provider. That connection is the only reason the app uses
                the internet, and it is the main subject of this policy.
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
                There is nowhere for the app to send your details, because no such service exists.
              </P>
              <P>Information the app creates stays on your device. That includes:</P>
              <UL>
                <LI>Your completed workout history, streaks and totals.</LI>
                <LI>
                  Preferences you set — body weight, units, theme, sound, voice guidance and
                  reminder time.
                </LI>
              </UL>
              <P>
                None of this is transmitted to the developer, and it is removed when you clear your
                workout history in Settings or uninstall the app.
              </P>
              <P>
                Advertising is different. When advertising is active, the advertising provider&apos;s
                software may process information about your device in order to select, deliver and
                measure ads. Depending on the provider, your consent choices and your device
                settings, that may include an advertising identifier, other device identifiers, IP
                address, device and application information, and approximate location. The developer
                does not receive this information in an identifiable form; it is processed by the
                advertising provider under its own policy.
              </P>
            </Clause>

            <Clause id="advertising" title="3. Advertising and Meta Audience Network">
              <P>
                The app integrates <strong className="font-medium text-ink">Meta Audience Network</strong>{' '}
                as its only advertising provider. It is not currently serving advertisements —
                see <a href="#consent" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">Consent and your privacy choices</a>.
                Where an ad is shown, Meta acts as the advertising provider and processes
                information in accordance with its own policies, which the developer does not
                control.
              </P>
              <P>Meta&apos;s official information:</P>
              <UL>
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
                No advertisement is requested before advertising has been enabled by your consent
                choice. See <a href="#consent" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">Consent and your privacy choices</a>.
              </P>
            </Clause>

            <Clause id="ad-formats" title="4. Rewarded and interstitial advertisements">
              <P>
                The app uses exactly two ad formats.{' '}
                <strong className="font-medium text-ink">There are no banner advertisements</strong>,
                and no ad is ever displayed during an exercise or during a rest period.
              </P>

              <div className="flex flex-col gap-4 rounded-xl border border-line surface-card p-5 sm:p-6">
                <h3 className="text-[15px] font-semibold text-ink">Interstitial advertisements</h3>
                <UL>
                  <LI>
                    Shown only when leaving the post-workout summary of an eligible free workout —
                    never mid-session, and never over your results.
                  </LI>
                  <LI>
                    Paced by the app: a cooldown between ads, a ceiling per app run, and nothing at
                    all until you have completed several workouts.
                  </LI>
                  <LI>
                    If no advertisement is available, you continue and leave the screen normally.
                  </LI>
                  <LI>Premium workout sessions never show an interstitial advertisement.</LI>
                </UL>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-line surface-card p-5 sm:p-6">
                <h3 className="text-[15px] font-semibold text-ink">Rewarded advertisements</h3>
                <UL>
                  <LI>
                    Always started by you. A rewarded advertisement is only requested after you
                    explicitly choose to watch one.
                  </LI>
                  <LI>
                    Watching one in full unlocks a single premium workout session. Nothing is
                    purchased and no payment is involved.
                  </LI>
                  <LI>
                    The reward is granted only when the advertising provider confirms the
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
                Advertising in the app is gated behind a consent check, and the app is
                built to{' '}
                <strong className="font-medium text-ink">fail closed</strong>: advertising
                is enabled only on a positive result. Where consent is refused, has not
                been determined, or cannot be established, the advertising provider is{' '}
                <strong className="font-medium text-ink">
                  never started and no advertisement is requested
                </strong>
                .
              </P>
              <P>
                <strong className="font-medium text-ink">
                  In this release no consent platform is connected
                </strong>
                , so that check cannot return a positive result and{' '}
                <strong className="font-medium text-ink">
                  no advertisements are served
                </strong>
                . The advertising provider is not started and no advertising request is
                made. The app is fully usable in this state.
              </P>
              <P>
                Should a consent platform be connected in a future version, this page will
                be updated before that version is released, and advertising would only
                begin after a consent choice had actually been obtained.
              </P>
              <P>
                You can also limit ad personalisation at the operating-system level. On
                Android this is normally found under Settings → Google → Ads, where you can
                reset or delete your advertising ID. Those controls are provided by your
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
                  advertising provider uses the information it processes to select, deliver,
                  measure and report on advertisements, and to detect invalid activity.
                </LI>
              </UL>
              <P>
                The developer does not sell your information, and does not build advertising or
                marketing profiles about you.
              </P>
            </Clause>

            <Clause id="third-parties" title="7. Third-party services">
              <P>
                One third-party component is embedded in the app:{' '}
                <strong className="font-medium text-ink">Meta Audience Network</strong>,
                the advertising provider. It is the only advertising network in the app,
                and as described above it is not started while no consent platform is
                connected.
              </P>
              <P>
                There is no analytics service, no crash-reporting service, no advertising
                mediation layer, and no Google advertising SDK in this release.
              </P>
              <P>
                Meta processes information under its own terms and privacy policy, linked in{' '}
                <a href="#advertising" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 3
                </a>
                . Distribution through Google Play is also subject to Google&apos;s own policies,
                which apply independently of this document.
              </P>
            </Clause>

            <Clause id="retention" title="8. Data retention">
              <P>
                Workout history and preferences are kept on your device until you delete them.
                Clearing your workout history in Settings removes the stored sessions, and
                uninstalling the app removes the app&apos;s local data.
              </P>
              <P>
                A premium workout unlock earned from a rewarded advertisement is held in memory only
                and is not written to storage, so it does not survive the session.
              </P>
              <P>
                The developer retains nothing, because nothing is sent to the developer. Any
                retention of advertising data is determined by the advertising provider under its
                own policy.
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
                Because the app stores its data locally and operates no backend, the security of
                that data rests largely on your device — its lock screen, encryption and operating
                system updates.
              </P>
              <P>
                Network communication for advertising is handled by the advertising provider&apos;s
                software. No method of transmission or storage is completely secure, and no absolute
                guarantee of security can be given.
              </P>
            </Clause>

            <Clause id="rights" title="11. Your privacy rights">
              <P>
                Depending on where you live, you may have rights over your personal information,
                such as access, correction, deletion, or objecting to certain processing.
              </P>
              <P>
                Because the developer holds no personal information about you, most requests are
                satisfied directly on your device: clearing your workout history or uninstalling the
                app removes the app&apos;s local data, and your device&apos;s advertising controls
                govern ad personalisation.
              </P>
              <P>
                Where a request concerns information processed by the advertising provider, it is
                best directed to that provider, whose policy is linked in{' '}
                <a href="#advertising" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent-blue">
                  section 3
                </a>
                . You are welcome to contact the developer and any request will be forwarded or
                answered as far as is possible.
              </P>
            </Clause>

            <Clause id="changes" title="12. Changes to this Privacy Policy">
              <P>
                This policy may be updated as the app changes — for example if an advertising
                provider is added or replaced, or if a consent flow is introduced. The date at the
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
                For any question about this policy or about privacy in {APP_NAME}, please get in
                touch.
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
