'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import {
  EVENT_FORM_FIELDS,
  EVENT_POLICY_CATEGORY,
  EVENT_TITLE_PLACEHOLDERS,
  EVENT_TYPE_LABELS,
  UI_TEXTS,
  VIEW_LABELS,
} from '@/domain/demoConfig';
import { EventType } from '@/domain/traceability';
import { truncateHash } from '@/lib/format';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

const inputClassName =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20';

export function RegisterEventView() {
  const { registerSignedEvent } = useTraceability();
  const [eventType, setEventType] = useState<EventType>('VACUNACION');
  const [title, setTitle] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [lastHash, setLastHash] = useState('');

  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    setFieldValues({});
    setStatus('idle');
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setStatus('loading');

    const metadata = Object.fromEntries(
      EVENT_FORM_FIELDS[eventType]
        .map((field) => [field, fieldValues[field]?.trim() ?? ''] as const)
        .filter(([, value]) => value !== '')
    );

    try {
      const signedEvent = await registerSignedEvent({
        type: eventType,
        title: title.trim(),
        metadata,
        visibilityCategory: EVENT_POLICY_CATEGORY[eventType],
      });
      setLastHash(signedEvent.signatureHash);
      setTitle('');
      setFieldValues({});
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <section>
      <h2 className="mb-4 text-base font-bold text-emerald-950">{VIEW_LABELS.REGISTER.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-stone-600">Tipo de hito</span>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  type === eventType
                    ? 'border-emerald-950 bg-emerald-950 text-white'
                    : 'border-stone-300 bg-white text-stone-600 hover:border-emerald-600'
                }`}
              >
                {EVENT_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-stone-600">Título</span>
          <input
            required
            value={title}
            onChange={(changeEvent) => setTitle(changeEvent.target.value)}
            placeholder={EVENT_TITLE_PLACEHOLDERS[eventType]}
            className={inputClassName}
          />
        </label>

        {EVENT_FORM_FIELDS[eventType].map((field) => (
          <label key={field} className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-600">{field}</span>
            <input
              value={fieldValues[field] ?? ''}
              onChange={(changeEvent) =>
                setFieldValues((prev) => ({ ...prev, [field]: changeEvent.target.value }))
              }
              className={inputClassName}
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-950 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-70"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {isLoading ? UI_TEXTS.signingLabel : UI_TEXTS.submitLabel}
        </button>

        {status === 'success' && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={14} />
              {UI_TEXTS.signedSuccess}
            </p>
            <p className="mt-1 break-all font-mono text-[11px] text-emerald-900">
              {truncateHash(lastHash)}
            </p>
          </div>
        )}

        {status === 'error' && (
          <p className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-700">
            <TriangleAlert size={14} />
            {UI_TEXTS.signedError}
          </p>
        )}
      </form>
    </section>
  );
}
