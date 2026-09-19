'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addActivityAction } from '@/lib/us/actions/pick';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import type { ActionState } from '@/lib/us/model';

export function AddActivityForm() {
  const [state, action] = useActionState<ActionState, FormData>(addActivityAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input
          name="label"
          required
          maxLength={120}
          placeholder="Cook something neither of us has made"
          aria-label="Activity"
          className="us-field"
        />
        {state?.ok === false ? <FormError message={state.message} /> : null}
        <Submit variant="quiet" pendingLabel="Adding…">
          Add
        </Submit>
      </PendingFieldset>
    </form>
  );
}
