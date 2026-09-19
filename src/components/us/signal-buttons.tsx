'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendSignalAction } from '@/lib/us/actions/signals';
import { acknowledgeSignalAction } from '@/lib/us/actions/signals';
import { SIGNAL, type ActionState, type SignalKind } from '@/lib/us/model';
import { cn } from '@/lib/utils';

/** The four signals that sit on the home screen. */
const QUICK: SignalKind[] = ['miss_you', 'need_you', 'want_to_see_you', 'call_me'];

function SignalButton({ kind, wide }: { kind: SignalKind; wide?: boolean }) {
  const { pending } = useFormStatus();
  const meta = SIGNAL[kind];

  return (
    <button
      type="submit"
      name="kind"
      value={kind}
      disabled={pending}
      className={cn(
        'group flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-[16px]',
        'border border-us-line bg-[rgba(236,220,216,0.035)] px-3 py-3 text-center',
        'transition-[background-color,border-color,transform] duration-200',
        'active:scale-[0.97] hover:border-us-line-strong hover:bg-[rgba(236,220,216,0.06)]',
        'disabled:opacity-50',
        wide && 'col-span-2',
      )}
    >
      <span aria-hidden className="text-[17px] leading-none">
        {meta.icon}
      </span>
      <span className="text-[13px] font-medium leading-tight text-us-ink">{meta.action}</span>
    </button>
  );
}

export function QuickSignals() {
  const [state, action] = useActionState<ActionState, FormData>(sendSignalAction, null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.message) return;
    setFlash(state.message);
    const t = setTimeout(() => setFlash(null), 2600);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <form action={action}>
      <div className="grid grid-cols-2 gap-2.5">
        {QUICK.map((kind) => (
          <SignalButton key={kind} kind={kind} />
        ))}
      </div>

      <p
        aria-live="polite"
        className={cn(
          'mt-2.5 text-center text-[12.5px] transition-opacity duration-300',
          flash ? 'opacity-100' : 'opacity-0',
          state?.ok === false ? 'text-[#E7A0A0]' : 'text-us-sage',
        )}
      >
        {flash ?? ' '}
      </p>
    </form>
  );
}

/** The remaining, gentler signals — shown on the signals page. */
export function MoreSignals() {
  const [state, action] = useActionState<ActionState, FormData>(sendSignalAction, null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.message) return;
    setFlash(state.message);
    const t = setTimeout(() => setFlash(null), 2600);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <form action={action}>
      <div className="grid grid-cols-2 gap-2.5">
        {(Object.keys(SIGNAL) as SignalKind[]).map((kind) => (
          <SignalButton key={kind} kind={kind} />
        ))}
      </div>
      <p
        aria-live="polite"
        className={cn(
          'mt-2.5 text-center text-[12.5px] transition-opacity duration-300',
          flash ? 'opacity-100' : 'opacity-0',
          state?.ok === false ? 'text-[#E7A0A0]' : 'text-us-sage',
        )}
      >
        {flash ?? ' '}
      </p>
    </form>
  );
}

function AckButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full px-4',
        'bg-us-rose text-[13.5px] font-medium text-[#231314]',
        'transition-transform duration-200 active:scale-[0.97] disabled:opacity-55',
      )}
    >
      {pending ? 'Sending…' : "I'm here ❤️"}
    </button>
  );
}

export function AcknowledgeButton({ signalId }: { signalId: string }) {
  const [, action] = useActionState<ActionState, FormData>(acknowledgeSignalAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={signalId} />
      <AckButton />
    </form>
  );
}
