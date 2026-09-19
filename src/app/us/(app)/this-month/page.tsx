import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import { requireUser } from '@/lib/us/auth';
import { getPriorities, getUnreadCount } from '@/lib/us/queries';
import { currentMonth, formatMonth } from '@/lib/us/model';
import { removePriorityAction, togglePriorityAction } from '@/lib/us/actions/priorities';
import { Card, CardTitle, Disclosure, Empty, PageIntro, Screen, TopBar } from '@/components/us/chrome';
import { AddPriorityForm } from './add-priority-form';

export const metadata: Metadata = { title: 'This month' };
export const dynamic = 'force-dynamic';

export default async function ThisMonthPage() {
  const user = await requireUser();
  const month = currentMonth();
  const [priorities, unread] = await Promise.all([
    getPriorities(month),
    getUnreadCount(user.id),
  ]);

  const done = priorities.filter((p) => p.done_at).length;

  return (
    <>
      <TopBar title="This month" back={{ href: '/us/more', label: 'more' }} unread={unread} />
      <Screen>
        <PageIntro
          eyebrow={formatMonth(month)}
          title="What this month is about"
          lead="A few things only. This is where the long plan turns into something you can actually do before the month ends."
        />

        <Card className="mb-5">
          <CardTitle>
            {priorities.length > 0 ? `${done} of ${priorities.length} done` : 'Our priorities'}
          </CardTitle>

          {priorities.length === 0 ? (
            <Empty>Nothing chosen yet. Three or four is usually right.</Empty>
          ) : (
            <ul className="-my-1 divide-y divide-us-line">
              {priorities.map((p) => (
                <li key={p.id} className="flex items-center gap-2 py-2.5">
                  <form action={togglePriorityAction} className="min-w-0 flex-1">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      aria-pressed={Boolean(p.done_at)}
                      className="flex w-full items-center gap-3 rounded-[12px] py-1 text-left"
                    >
                      <span
                        aria-hidden
                        className={
                          p.done_at
                            ? 'flex size-[30px] shrink-0 items-center justify-center rounded-[10px] border border-us-sage bg-us-sage text-[#16211a]'
                            : 'flex size-[30px] shrink-0 items-center justify-center rounded-[10px] border border-us-line bg-[rgba(236,220,216,0.04)] text-[15px]'
                        }
                      >
                        {p.done_at ? <Check size={15} strokeWidth={3} /> : p.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={
                            p.done_at
                              ? 'block text-[14.5px] text-us-dim line-through decoration-us-dim'
                              : 'block text-[14.5px] text-us-ink'
                          }
                        >
                          {p.label}
                        </span>
                        {p.note ? (
                          <span className="mt-0.5 block text-[12px] leading-snug text-us-dim">
                            {p.note}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </form>
                  <form action={removePriorityAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="flex size-9 items-center justify-center rounded-full text-us-dim transition-colors hover:text-[#E7A0A0]"
                    >
                      <X size={15} aria-hidden />
                      <span className="sr-only">Remove {p.label}</span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Disclosure label="Add a priority">
          <AddPriorityForm month={month} />
        </Disclosure>
      </Screen>
    </>
  );
}
