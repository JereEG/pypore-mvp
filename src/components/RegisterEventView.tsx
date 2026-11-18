'use client';

import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldCheck,
  TriangleAlert,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { EventRegistrationError, useTraceability } from '@/context/TraceabilityContext';
import {
  EVENT_FORM_FIELDS,
  EVENT_POLICY_CATEGORY,
  EVENT_TITLE_PLACEHOLDERS,
  EVENT_TYPE_LABELS,
  UI_TEXTS,
  VIEW_LABELS,
} from '@/domain/demoConfig';
import { EventType, TraceabilityEvent } from '@/domain/traceability';
import { HederaTransactionLink } from './HederaTransactionLink';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

const inputClassName =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20';

export function RegisterEventView() {
  const {
    isOfflineFieldMode,
    toggleOfflineFieldMode,
    registerSignedEvent,
    registerOfflineFallbackEvent,
  } = useTraceability();
  const [eventType, setEventType] = useState<EventType>('VACUNACION');
  const [title, setTitle] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [lastSignedEvent, setLastSignedEvent] = useState<TraceabilityEvent | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const buildEventInput = () => {
    const metadata = Object.fromEntries(
      EVENT_FORM_FIELDS[eventType]
        .map((field) => [field, fieldValues[field]?.trim() ?? ''] as const)
        .filter(([, value]) => value !== '')
    );

    return {
      type: eventType,
      title: title.trim(),
      metadata,
      visibilityCategory: EVENT_POLICY_CATEGORY[eventType],
    };
  };

  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    setFieldValues({});
    setStatus('idle');
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setStatus('loading');

    if (isOfflineFieldMode) {
      const offlineEvent = await registerOfflineFallbackEvent(buildEventInput());
      setLastSignedEvent(offlineEvent);
      setTitle('');
      setFieldValues({});
      setStatus('success');
      return;
    }

    try {
      const signedEvent = await registerSignedEvent(buildEventInput());
      setLastSignedEvent(signedEvent);
      setTitle('');
      setFieldValues({});
      setStatus('success');
    } catch (error) {
      setErrorMessage(
        error instanceof EventRegistrationError ? error.message : UI_TEXTS.signedError
      );
      setStatus('error');
    }
  };

  const handleOfflineFallback = async () => {
    if (!title.trim()) {
      return;
    }
    setStatus('loading');
    const offlineEvent = await registerOfflineFallbackEvent(buildEventInput());
    setLastSignedEvent(offlineEvent);
    setTitle('');
    setFieldValues({});
    setStatus('success');
  };

  const isLoading = status === 'loading';

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-emerald-950">{VIEW_LABELS.REGISTER.title}</h2>

      <div
        className={`mb-4 rounded-xl border p-3 transition ${
          isOfflineFieldMode
            ? 'border-amber-300 bg-amber-50'
            : 'border-emerald-200 bg-emerald-50/70'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                isOfflineFieldMode
                  ? 'bg-amber-500/20 text-amber-800'
                  : 'bg-emerald-600/15 text-emerald-700'
              }`}
            >
              {isOfflineFieldMode ? <WifiOff size={14} /> : <Wifi size={14} />}
            </span>
            <div>
              <p
                className={`text-xs font-bold ${
                  isOfflineFieldMode ? 'text-amber-900' : 'text-emerald-950'
                }`}
              >
                {UI_TEXTS.offlineModeLabel}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-stone-600">
                {UI_TEXTS.offlineModeDescription}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isOfflineFieldMode}
            aria-label={UI_TEXTS.offlineModeLabel}
            onClick={toggleOfflineFieldMode}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              isOfflineFieldMode ? 'bg-amber-600' : 'bg-stone-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                isOfflineFieldMode ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

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
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition disabled:opacity-70 ${
            isOfflineFieldMode
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-emerald-950 hover:bg-emerald-900'
          }`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isOfflineFieldMode ? (
            <WifiOff size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          {isLoading
            ? UI_TEXTS.signingLabel
            : isOfflineFieldMode
              ? UI_TEXTS.offlineSubmitLabel
              : UI_TEXTS.submitLabel}
        </button>

        {status === 'success' && lastSignedEvent && (
          <div
            className={`rounded-lg border p-3 ${
              lastSignedEvent.isOfflinePending
                ? 'border-amber-300 bg-amber-50'
                : 'border-emerald-300 bg-emerald-50'
            }`}
          >
            {lastSignedEvent.isOfflinePending ? (
              <>
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Clock3 size={14} />
                  {UI_TEXTS.signedOfflineSuccess}
                </p>
                <p className="mt-1 break-all font-mono text-[11px] text-amber-900">
                  {lastSignedEvent.hederaTransactionId}
                </p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} />
                  {UI_TEXTS.signedSuccess} · {UI_TEXTS.hashVerified}
                </p>
                <HederaTransactionLink
                  transactionId={lastSignedEvent.hederaTransactionId}
                  hashscanUrl={lastSignedEvent.hashscanUrl}
                  className="mt-1 break-all text-[11px]"
                />
              </>
            )}
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <div className="flex items-start gap-2">
              <TriangleAlert size={14} className="mt-0.5 shrink-0 text-red-600" />
              <p className="flex-1 font-medium leading-relaxed">{errorMessage}</p>
              <button
                type="button"
                aria-label={UI_TEXTS.dismissError}
                onClick={() => setStatus('idle')}
                className="shrink-0 rounded p-0.5 text-red-500 transition hover:bg-red-100"
              >
                <X size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleOfflineFallback}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-400 bg-amber-100 px-3 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-200"
            >
              <WifiOff size={14} />
              {UI_TEXTS.offlineSubmitLabel}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
