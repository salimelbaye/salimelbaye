import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getSurprises, getUnreadCount } from '@/lib/us/queries';
import { SURPRISE_KIND_LABEL, formatDate, timeAgo } from '@/lib/us/model';
import { openSurpriseAction } from '@/lib/us/actions/sealed';
import {
  Card,
  CardTitle,
  Disclosure,
  Empty,
  PageIntro,
  Pill,
  Screen,
  TopBar,
} from '@/components/us/chrome';
import { NewSurpriseForm } from './sealed-forms';

export const metadata: Metadata = { title: 'Surprises' };
export const dynamic = 'force-dynamic';

const pad = (n: number) => String(n).padStart(3, '0');

export default async function SurprisesPage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const [surprises, unread] = await Promise.all([
    getSurprises(user.id),
    getUnreadCount(user.id),
  ]);

  const forMe = surprises.filter((s) => s.recipient_id === user.id);
  const fromMe = surprises.filter((s) => s.author_id === user.id);
  const waiting = forMe.filter((s) => !s.opened_at);

  return (
    <>
      <TopBar title="Surprises" unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Surprises"
          title={waiting.length ? `${waiting.length} waiting for you` : 'Surprises'}
          lead="Something small, kept back for the right moment."
        />

        <Card className="mb-5">
          <CardTitle>For you</CardTitle>
          {forMe.length === 0 ? (
            <Empty>Nothing yet.</Empty>
          ) : (
            <ul className="space-y-2.5">
              {forMe.map((s) => {
                const notYet = s.unlock_at !== null && s.unlock_at > Date.now();
                return (
                  <li key={s.id}>
                    {s.opened_at ? (
                      <Link
                        href={`/us/surprises/${s.id}`}
                        className="us-inset flex items-center gap-3 rounded-[14px] px-4 py-3.5 transition-colors hover:bg-[rgba(236,220,216,0.06)]"
                      >
                        <span className="font-mono text-[11px] text-us-dim">#{pad(s.number)}</span>
                        <span className="min-w-0 flex-1 truncate text-[14.5px] text-us-ink">
                          {s.title}
                        </span>
                        <Pill tone="sage">Opened</Pill>
                      </Link>
                    ) : (
                      <form action={openSurpriseAction}>
                        <input type="hidden" name="id" value={s.id} />
                        <div className="us-inset flex items-center gap-3 rounded-[14px] px-4 py-3">
                          <Lock size={15} className="shrink-0 text-us-amber" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block font-mono text-[11px] text-us-dim">
                              Surprise #{pad(s.number)}
                            </span>
                            <span className="mt-0.5 block truncate text-[14.5px] text-us-ink">
                              {s.title}
                            </span>
                            {notYet && s.unlock_at ? (
                              <span className="mt-1 block text-[11.5px] text-us-amber">
                                Unlocks{' '}
                                {formatDate(new Date(s.unlock_at).toISOString().slice(0, 10))}
                              </span>
                            ) : null}
                          </span>
                          {notYet ? (
                            <Pill tone="amber">Locked</Pill>
                          ) : (
                            <button
                              type="submit"
                              className="shrink-0 rounded-full bg-us-rose px-4 py-2 text-[13px] font-medium text-[#231314] transition-transform active:scale-[0.97]"
                            >
                              Open
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="mb-5">
          <Disclosure label={`Prepare a surprise for ${partner.name}`}>
            <NewSurpriseForm partnerName={partner.name} />
          </Disclosure>
        </div>

        {fromMe.length > 0 ? (
          <Card className="mb-5">
            <CardTitle>From you</CardTitle>
            <ul className="-my-1 divide-y divide-us-line">
              {fromMe.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-3">
                  <span className="font-mono text-[11px] text-us-dim">#{pad(s.number)}</span>
                  <Link
                    href={`/us/surprises/${s.id}`}
                    className="min-w-0 flex-1 truncate text-[14px] text-us-ink hover:underline"
                  >
                    {s.title}
                  </Link>
                  <span className="shrink-0 text-[11.5px] text-us-dim">
                    {s.opened_at ? `opened ${timeAgo(s.opened_at)}` : 'sealed'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        <Link
          href="/us/open-when"
          className="us-surface flex min-h-[64px] items-center gap-3 px-4 transition-colors hover:bg-[rgba(236,220,216,0.05)]"
        >
          <Lock size={17} className="shrink-0 text-us-rose" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] text-us-ink">Open when…</span>
            <span className="mt-0.5 block text-[12px] text-us-dim">
              Notes for a specific moment
            </span>
          </span>
        </Link>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-us-dim">
          {SURPRISE_KIND_LABEL.message}, {SURPRISE_KIND_LABEL.activity.toLowerCase()} or{' '}
          {SURPRISE_KIND_LABEL.plan.toLowerCase()} — never a photo.
        </p>
      </Screen>
    </>
  );
}
