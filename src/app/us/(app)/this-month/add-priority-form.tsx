'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addPriorityAction } from '@/lib/us/actions/priorities';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import { PRIORITY_ICONS, type ActionState } from '@/lib/us/model';

export function AddPriorityForm({ month }: { month: string }) {
  const [state, action] = useActionState<ActionState, FormData>(addPriorityAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input type="hidden" name="month" value={month} />

        <fieldset>
          <legend className="us-label">Pick a symbol</legend>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_ICONS.map((icon, i) => (
              <label key={icon} className="cursor-pointer">
                <input
                  type="radio"
                  name="icon"
                  value={icon}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="flex size-11 items-center justify-center rounded-[13px] border border-us-line bg-[rgba(236,220,216,0.04)] text-[17px] transition-colors peer-checked:border-us-rose peer-checked:bg-us-rose-soft peer-focus-visible:border-us-rose">
                  {icon}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <input
          name="label"
          required
          maxLength={80}
          placeholder="Money"
          aria-label="Priority"
          className="us-field"
        />
        <input
          name="note"
          maxLength={300}
          placeholder="What that actually means this month"
          aria-label="Note"
          className="us-field"
        />

        {state?.ok === false ? <FormError message={state.message} /> : null}
        <Submit pendingLabel="Adding…">Add priority</Submit>
      </PendingFieldset>
    </form>
  );
}
