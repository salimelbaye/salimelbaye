'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createOpenWhenAction, createSurpriseAction } from '@/lib/us/actions/sealed';
import { FormError, FormNote, PendingFieldset, Submit } from '@/components/us/form';
import {
  OPEN_WHEN_SUGGESTIONS,
  SURPRISE_KINDS,
  SURPRISE_KIND_LABEL,
  type ActionState,
} from '@/lib/us/model';

export function NewSurpriseForm({ partnerName }: { partnerName: string }) {
  const [state, action] = useActionState<ActionState, FormData>(createSurpriseAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <input
          name="title"
          required
          maxLength={120}
          placeholder="A title that gives nothing away"
          aria-label="Title"
          className="us-field"
        />

        <div>
          <label className="us-label" htmlFor="surprise-kind">
            What kind
          </label>
          <select id="surprise-kind" name="kind" defaultValue="message" className="us-field">
            {SURPRISE_KINDS.map((k) => (
              <option key={k} value={k}>
                {SURPRISE_KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="body"
          required
          rows={5}
          maxLength={6000}
          placeholder="The surprise itself"
          aria-label="The surprise"
          className="us-field resize-y"
        />

        <div>
          <label className="us-label" htmlFor="surprise-unlock">
            Locked until <span className="text-us-dim">(optional)</span>
          </label>
          <input
            id="surprise-unlock"
            name="unlock_at"
            type="date"
            className="us-field"
          />
        </div>

        {state?.ok === false ? <FormError message={state.message} /> : null}
        {state?.ok ? (
          <p role="status" className="text-[13px] text-us-sage">
            Sealed. {partnerName} will see it waiting.
          </p>
        ) : null}

        <Submit pendingLabel="Sealing…">Seal it</Submit>
        <FormNote>
          {partnerName} can see that it exists, never what is inside — the text stays on the
          server until it is opened.
        </FormNote>
      </PendingFieldset>
    </form>
  );
}

export function NewOpenWhenForm({ partnerName }: { partnerName: string }) {
  const [state, action] = useActionState<ActionState, FormData>(createOpenWhenAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-3">
      <PendingFieldset>
        <div>
          <label className="us-label" htmlFor="open-when-prompt">
            Open when…
          </label>
          <input
            id="open-when-prompt"
            name="prompt"
            required
            maxLength={120}
            list="open-when-suggestions"
            placeholder="you're having a bad day"
            className="us-field"
          />
          <datalist id="open-when-suggestions">
            {OPEN_WHEN_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <textarea
          name="body"
          required
          rows={6}
          maxLength={6000}
          placeholder="What you would want to say at exactly that moment"
          aria-label="The note"
          className="us-field resize-y"
        />

        <div>
          <label className="us-label" htmlFor="note-unlock">
            Not before <span className="text-us-dim">(optional)</span>
          </label>
          <input id="note-unlock" name="unlock_at" type="date" className="us-field" />
        </div>

        {state?.ok === false ? <FormError message={state.message} /> : null}
        {state?.ok ? (
          <p role="status" className="text-[13px] text-us-sage">
            Sealed for {partnerName}.
          </p>
        ) : null}

        <Submit pendingLabel="Sealing…">Seal this note</Submit>
      </PendingFieldset>
    </form>
  );
}
