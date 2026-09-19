'use client';

import { useFormStatus } from 'react-dom';
import { Check } from 'lucide-react';
import { togglePlanAction } from '@/lib/us/actions/plans';
import { cn } from '@/lib/utils';

/**
 * A checklist row.
 *
 * The server action is bound to the form directly rather than wrapped in a
 * client callback, so the tick still works with no JavaScript. With
 * JavaScript, useFormStatus flips the box the instant it is pressed and the
 * celebration rides the same pending state — no optimistic store to fall out
 * of sync with the server.
 */
function Toggle({
  done,
  title,
  note,
  doneBy,
}: {
  done: boolean;
  title: string;
  note?: string | null;
  doneBy?: string | null;
}) {
  const { pending } = useFormStatus();
  // While the request is in flight, show where it is heading.
  const shown = pending ? !done : done;
  const celebrating = pending && !done;

  return (
    <button
      type="submit"
      aria-pressed={shown}
      className="flex w-full items-start gap-3 rounded-[14px] px-1 py-3 text-left transition-colors hover:bg-[rgba(236,220,216,0.035)]"
    >
      <span
        aria-hidden
        className={cn(
          'relative mt-px flex size-[22px] shrink-0 items-center justify-center rounded-[8px] border',
          'transition-[background-color,border-color] duration-300',
          shown
            ? 'border-us-sage bg-us-sage text-[#16211a]'
            : 'border-us-line-strong bg-transparent text-transparent',
        )}
      >
        <Check size={14} strokeWidth={3} />
        {celebrating ? (
          <span className="absolute -inset-1 animate-us-seal rounded-[11px] ring-2 ring-us-sage/55" />
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-[15px] leading-snug transition-colors duration-300',
            shown ? 'text-us-dim line-through decoration-us-dim' : 'text-us-ink',
          )}
        >
          {title}
        </span>
        {note ? (
          <span className="mt-0.5 block text-[12.5px] leading-snug text-us-dim">{note}</span>
        ) : null}
        {done && doneBy ? (
          <span className="mt-1 block text-[11.5px] text-us-sage">Done by {doneBy}</span>
        ) : null}
      </span>
    </button>
  );
}

export function PlanItem({
  id,
  title,
  note,
  done,
  doneBy,
}: {
  id: string;
  title: string;
  note?: string | null;
  done: boolean;
  doneBy?: string | null;
}) {
  return (
    <form action={togglePlanAction}>
      <input type="hidden" name="id" value={id} />
      <Toggle done={done} title={title} note={note} doneBy={doneBy} />
    </form>
  );
}
