'use server';

import { redirect } from 'next/navigation';
import { changePassword } from '../auth';
import { requireUser } from '../auth';
import { destroySession } from '../session';
import type { ActionState } from '../model';
import { ValidationError, password as parsePassword, secret as parseSecret } from '../validate';

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect('/us/sign-in');
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const current = parseSecret(formData.get('current'), 'Current password');
    const next = parsePassword(formData.get('next'));
    const confirm = String(formData.get('confirm') ?? '');
    if (next !== confirm) return { ok: false, message: 'Those two passwords do not match.' };
    if (next === current) return { ok: false, message: 'Choose a different password.' };

    const result = await changePassword(user.id, current, next);
    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true, message: 'Password changed. Other devices were signed out.' };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}
