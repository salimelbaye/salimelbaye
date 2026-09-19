'use client';

import { useActionState } from 'react';
import { signInAction, type AuthFormState } from '../actions';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';

export function SignInForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(signInAction, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <PendingFieldset>
        <div>
          <label className="us-label" htmlFor="email">
            Email
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
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="us-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="us-field"
            placeholder="••••••••••••"
          />
        </div>

        <FormError message={state?.error} />

        <Submit pendingLabel="Opening…">Enter</Submit>
      </PendingFieldset>
    </form>
  );
}
