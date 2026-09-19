'use client';

import { useActionState } from 'react';
import { claimAction, type AuthFormState } from '../actions';
import { FormError, FormNote, PendingFieldset, Submit } from '@/components/us/form';
import { MIN_PASSWORD_LENGTH } from '@/lib/us/model';

export function ClaimForm({ presetToken }: { presetToken?: string }) {
  const [state, action] = useActionState<AuthFormState, FormData>(claimAction, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <PendingFieldset>
        <div>
          <label className="us-label" htmlFor="email">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="email"
            className="us-field"
          />
        </div>

        <div>
          <label className="us-label" htmlFor="token">
            Setup code
          </label>
          <input
            id="token"
            name="token"
            type="text"
            required
            defaultValue={presetToken}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="us-field font-mono text-[14px]"
          />
        </div>

        <div>
          <label className="us-label" htmlFor="password">
            Choose a password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            className="us-field"
          />
          <p className="mt-1.5 text-[12px] text-us-dim">
            At least {MIN_PASSWORD_LENGTH} characters. Let your phone generate and save it.
          </p>
        </div>

        <div>
          <label className="us-label" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            className="us-field"
          />
        </div>

        <FormError message={state?.error} />

        <Submit pendingLabel="Setting up…">Create my access</Submit>

        <FormNote>
          This works once per person. After that, the page can no longer create access.
        </FormNote>
      </PendingFieldset>
    </form>
  );
}
