'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addPlanAction } from '@/lib/us/actions/plans';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import type { ActionState } from '@/lib/us/model';

export function AddPlanForm() {
  const [state, action] = useActionState<ActionState, FormData>(addPlanAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the field after a successful add so the next idea can go straight in.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input
          name="title"
          required
          maxLength={160}
          placeholder="Walk by the sea"
          aria-label="Something to do together"
          className="us-field"
        />
        <input
          name="note"
          maxLength={500}
          placeholder="A detail, if you want one"
          aria-label="Note"
          className="us-field"
        />
        {state?.ok === false ? <FormError message={state.message} /> : null}
        <Submit pendingLabel="Adding…">Add to our list</Submit>
      </PendingFieldset>
    </form>
  );
}
