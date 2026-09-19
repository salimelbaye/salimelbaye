'use client';

import { useActionState } from 'react';
import { createGoalAction, updateGoalAction } from '@/lib/us/actions/goals';
import { FormError, PendingFieldset, Submit } from '@/components/us/form';
import {
  CATEGORIES,
  CATEGORY,
  GOAL_STATUSES,
  GOAL_STATUS_LABEL,
  HORIZONS,
  HORIZON_LABEL,
  type ActionState,
  type Category,
  type GoalStatus,
  type Horizon,
} from '@/lib/us/model';

export type GoalDefaults = {
  id?: string;
  title?: string;
  description?: string | null;
  category?: Category;
  horizon?: Horizon;
  target_date?: string | null;
  status?: GoalStatus;
  progress?: number;
  assigned_to?: string;
};

export function GoalForm({
  defaults,
  people,
  mode,
}: {
  defaults?: GoalDefaults;
  people: { both: string; me: { id: string; name: string }; partner: { id: string; name: string } };
  mode: 'create' | 'edit';
}) {
  const [state, action] = useActionState<ActionState, FormData>(
    mode === 'create' ? createGoalAction : updateGoalAction,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <PendingFieldset>
        {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}

        <div>
          <label className="us-label" htmlFor="title">
            What do we want?
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={160}
            defaultValue={defaults?.title}
            placeholder="Take our first trip together"
            className="us-field"
          />
        </div>

        <div>
          <label className="us-label" htmlFor="description">
            Why it matters <span className="text-us-dim">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={4000}
            defaultValue={defaults?.description ?? ''}
            className="us-field resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="us-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={defaults?.category ?? 'relationship'}
              className="us-field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY[c].icon} {CATEGORY[c].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="us-label" htmlFor="horizon">
              When
            </label>
            <select
              id="horizon"
              name="horizon"
              defaultValue={defaults?.horizon ?? 'this_year'}
              className="us-field"
            >
              {HORIZONS.map((h) => (
                <option key={h} value={h}>
                  {HORIZON_LABEL[h]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="us-label" htmlFor="target_date">
              Target date
            </label>
            <input
              id="target_date"
              name="target_date"
              type="date"
              defaultValue={defaults?.target_date ?? ''}
              className="us-field"
            />
          </div>

          <div>
            <label className="us-label" htmlFor="assigned_to">
              For
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              defaultValue={defaults?.assigned_to ?? 'both'}
              className="us-field"
            >
              <option value="both">Both of us</option>
              <option value={people.me.id}>{people.me.name}</option>
              <option value={people.partner.id}>{people.partner.name}</option>
            </select>
          </div>
        </div>

        {mode === 'edit' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="us-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={defaults?.status ?? 'planned'}
                className="us-field"
              >
                {GOAL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {GOAL_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="us-label" htmlFor="progress">
                Progress %
              </label>
              <input
                id="progress"
                name="progress"
                type="number"
                min={0}
                max={100}
                step={5}
                defaultValue={defaults?.progress ?? 0}
                className="us-field"
              />
            </div>
          </div>
        ) : null}

        {state?.ok === false ? <FormError message={state.message} /> : null}
        {state?.ok ? (
          <p role="status" className="text-[13px] text-us-sage">
            {state.message}
          </p>
        ) : null}

        <Submit pendingLabel="Saving…">{mode === 'create' ? 'Add to our plan' : 'Save'}</Submit>
      </PendingFieldset>
    </form>
  );
}
