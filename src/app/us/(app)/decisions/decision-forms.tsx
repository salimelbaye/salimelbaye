'use client';

import { useActionState, useEffect, useRef } from 'react';
import {
  createDecisionAction,
  decideAction,
  saveThoughtAction,
} from '@/lib/us/actions/decisions';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import type { ActionState } from '@/lib/us/model';

export function NewDecisionForm() {
  const [state, action] = useActionState<ActionState, FormData>(createDecisionAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input
          name="question"
          required
          maxLength={200}
          placeholder="Where do we want to live?"
          aria-label="The question"
          className="us-field"
        />
        <textarea
          name="context"
          rows={2}
          maxLength={2000}
          placeholder="Anything worth remembering about why this is on the table"
          aria-label="Context"
          className="us-field resize-y"
        />
        {state?.ok === false ? <FormError message={state.message} /> : null}
        <Submit pendingLabel="Opening…">Open this decision</Submit>
      </PendingFieldset>
    </form>
  );
}

export function ThoughtForm({
  decisionId,
  initial,
}: {
  decisionId: string;
  initial?: string | null;
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveThoughtAction, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input type="hidden" name="decision_id" value={decisionId} />
        <textarea
          name="body"
          required
          rows={5}
          maxLength={4000}
          defaultValue={initial ?? ''}
          placeholder="What do you actually think? Nobody is grading this."
          aria-label="Your thoughts"
          className="us-field resize-y"
        />
        {state?.ok === false ? <FormError message={state.message} /> : null}
        {state?.ok ? (
          <p role="status" className="text-[13px] text-us-sage">
            {state.message}
          </p>
        ) : null}
        <Submit variant="quiet" pendingLabel="Saving…">
          {initial ? 'Update my thoughts' : 'Save my thoughts'}
        </Submit>
      </PendingFieldset>
    </form>
  );
}

export function DecideForm({
  decisionId,
  initial,
}: {
  decisionId: string;
  initial?: string | null;
}) {
  const [state, action] = useActionState<ActionState, FormData>(decideAction, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input type="hidden" name="decision_id" value={decisionId} />
        <textarea
          name="outcome"
          required
          rows={3}
          maxLength={2000}
          defaultValue={initial ?? ''}
          placeholder="What we decided, in one or two sentences"
          aria-label="Our decision"
          className="us-field resize-y"
        />
        {state?.ok === false ? <FormError message={state.message} /> : null}
        {state?.ok ? (
          <p role="status" className="text-[13px] text-us-sage">
            {state.message}
          </p>
        ) : null}
        <Submit pendingLabel="Recording…">{initial ? 'Update our decision' : 'This is our decision'}</Submit>
      </PendingFieldset>
    </form>
  );
}
