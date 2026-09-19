import type { Metadata } from 'next';
import { Lock, LockOpen } from 'lucide-react';
import { requirePartner, requireUser } from '@/lib/us/auth';
import { getOpenWhenNotes, getUnreadCount } from '@/lib/us/queries';
import { formatDate, timeAgo } from '@/lib/us/model';
import { deleteOpenWhenAction, openNoteAction } from '@/lib/us/actions/sealed';
import { Card, CardTitle, Disclosure, Empty, PageIntro, Pill, Screen, TopBar } from '@/components/us/chrome';
import { NewOpenWhenForm } from '../surprises/sealed-forms';

export const metadata: Metadata = { title: 'Open when…' };
export const dynamic = 'force-dynamic';

export default async function OpenWhenPage() {
  const user = await requireUser();
  const partner = await requirePartner(user);
  const [notes, unread] = await Promise.all([
    getOpenWhenNotes(user.id),
    getUnreadCount(user.id),
  ]);

  const forMe = notes.filter((n) => n.recipient_id === user.id);
  const fromMe = notes.filter((n) => n.author_id === user.id);

  return (
    <>
      <TopBar title="Open when…" back={{ href: '/us/surprises', label: 'surprises' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow="Open when"
          title="For a specific moment"
          lead="Written now, read exactly when it is needed."
        />

        <Card className="mb-5">
          <CardTitle>For you</CardTitle>
          {forMe.length === 0 ? (
            <Empty>{partner.name} hasn&rsquo;t left you one yet.</Empty>
          ) : (
            <ul className="space-y-2.5">
              {forMe.map((note) => {
                const notYet = note.unlock_at !== null && note.unlock_at > Date.now();
                return (
                  <li key={note.id} className="us-inset rounded-[14px] px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      {note.opened_at ? (
                        <LockOpen size={15} className="mt-1 shrink-0 text-us-sage" aria-hidden />
                      ) : (
                        <Lock size={15} className="mt-1 shrink-0 text-us-rose" aria-hidden />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[1.08rem] leading-snug text-us-ink">
                          Open when {note.prompt}
                        </p>
                        {notYet && note.unlock_at ? (
                          <p className="mt-1.5 text-[11.5px] text-us-amber">
                            Not before {formatDate(new Date(note.unlock_at).toISOString().slice(0, 10))}
                          </p>
                        ) : null}
                        {note.body !== null ? (
                          <p className="us-prose mt-3 animate-us-seal">{note.body}</p>
                        ) : null}
                        {note.opened_at ? (
                          <p className="mt-2.5 text-[11.5px] text-us-dim">
                            Opened {timeAgo(note.opened_at)}
                          </p>
                        ) : notYet ? (
                          <div className="mt-3">
                            <Pill tone="amber">Locked</Pill>
                          </div>
                        ) : (
                          <form action={openNoteAction} className="mt-3">
                            <input type="hidden" name="id" value={note.id} />
                            <button
                              type="submit"
                              className="rounded-full bg-us-rose px-4 py-2 text-[13px] font-medium text-[#231314] transition-transform active:scale-[0.97]"
                            >
                              Open it
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="mb-5">
          <Disclosure label={`Write one for ${partner.name}`}>
            <NewOpenWhenForm partnerName={partner.name} />
          </Disclosure>
        </div>

        {fromMe.length > 0 ? (
          <Card>
            <CardTitle>From you</CardTitle>
            <ul className="-my-1 divide-y divide-us-line">
              {fromMe.map((note) => (
                <li key={note.id} className="flex items-center gap-3 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-us-ink">
                      Open when {note.prompt}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-us-dim">
                      {note.opened_at ? `opened ${timeAgo(note.opened_at)}` : 'still sealed'}
                    </span>
                  </span>
                  <form action={deleteOpenWhenAction}>
                    <input type="hidden" name="id" value={note.id} />
                    <button
                      type="submit"
                      className="shrink-0 rounded-full px-3 py-2 text-[12px] text-us-dim transition-colors hover:text-[#E7A0A0]"
                    >
                      Withdraw
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </Screen>
    </>
  );
}
