'use client';

import { useActionState } from 'react';
import { changePasswordAction } from '@/lib/us/actions/account';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import { MIN_PASSWORD_LENGTH, type ActionState } from '@/lib/us/model';

export function ChangePasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(changePasswordAction, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input
          type="password"
          name="current"
          required
          placeholder="Current password"
          aria-label="Current password"
          autoComplete="current-password"
          className="us-field"
        />
        <input
          type="password"
          name="next"
          required
          minLength={MIN_PASSWORD_LENGTH}
          placeholder="New password"
          aria-label="New password"
          autoComplete="new-password"
          className="us-field"
        />
        <input
          type="password"
          name="confirm"
          required
          minLength={MIN_PASSWORD_LENGTH}
          placeholder="Confirm new password"
          aria-label="Confirm new password"
          autoComplete="new-password"
          className="us-field"
        />

        {state?.ok === false ? <FormError message={state.message} /> : null}
        {state?.ok ? (
          <p role="status" className="text-[13px] text-us-sage">
            {state.message}
          </p>
        ) : null}

        <Submit variant="quiet" pendingLabel="Updating…">
          Update password
        </Submit>
      </PendingFieldset>
    </form>
  );
}
