'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addMilestoneAction } from '@/lib/us/actions/story';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import type { ActionState } from '@/lib/us/model';

export function AddMilestoneForm() {
  const [state, action] = useActionState<ActionState, FormData>(addMilestoneAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <div>
          <label className="us-label" htmlFor="milestone-date">
            When
          </label>
          <input
            id="milestone-date"
            name="event_date"
            type="date"
            required
            className="us-field"
          />
        </div>
        <div>
          <label className="us-label" htmlFor="milestone-title">
            What happened
          </label>
          <input
            id="milestone-title"
            name="title"
            required
            maxLength={160}
            placeholder="The first time we talked for hours"
            className="us-field"
          />
        </div>
        <textarea
          name="description"
          rows={4}
          maxLength={4000}
          placeholder="How it actually felt. Nobody else is reading this."
          aria-label="Description"
          className="us-field resize-y"
        />
        {state?.ok === false ? <FormError message={state.message} /> : null}
        <Submit pendingLabel="Adding…">Add to our story</Submit>
      </PendingFieldset>
    </form>
  );
}
