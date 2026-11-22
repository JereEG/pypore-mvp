'use client';

import { useRef, useState } from 'react';
import {
  BadgeCheck,
  Baby,
  CheckCircle2,
  Clock3,
  Database,
  Loader2,
  LockKeyhole,
  LucideIcon,
  Printer,
  QrCode,
  RefreshCw,
  RotateCcw,
  Scale,
  Syringe,
  Truck,
  X,
} from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { EVENT_TYPE_LABELS, UI_TEXTS, VIEW_LABELS } from '@/domain/demoConfig';
import { EventType, TraceabilityEvent, TripleSignature } from '@/domain/traceability';
import { formatTechnicalDate, truncateHash } from '@/lib/format';
import { HederaTransactionLink } from './HederaTransactionLink';

const EVENT_ICONS: Record<EventType, LucideIcon> = {
  NACIMIENTO: Baby,
  VACUNACION: Syringe,
  PESAJE: Scale,
  TRASLADO: Truck,
};

function SignatureChips({ signatures }: { signatures: TripleSignature }) {
  const slots: { label: string; value?: string }[] = [
    { label: 'Productor', value: signatures.producer },
    { label: 'Vet. Matriculado', value: signatures.veterinarian },
    { label: 'SENASA / Validador', value: signatures.authority },
  ];

  return (
    <div className="mt-3 rounded-lg border border-stone-100 bg-stone-50 p-2.5">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
        Triple Firma Verificable
      </p>
      <div className="flex flex-wrap gap-1.5">
        {slots.map((slot) => {
          const isSigned = Boolean(slot.value);
          return (
            <span
              key={slot.label}
              title={slot.value ?? `${slot.label}: Pendiente`}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                isSigned
                  ? 'bg-emerald-600/10 text-emerald-800 ring-1 ring-emerald-600/25'
                  : 'bg-stone-200/70 text-stone-500'
              }`}
            >
              {isSigned ? <CheckCircle2 size={10} /> : <Clock3 size={10} />}
              <span>{slot.label}</span>
              {slot.value && (
                <span className="max-w-[9rem] truncate font-normal opacity-80">
                  · {slot.value}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TimelineEvent({
  event,
  isLocked,
  onSelectPrint,
}: {
  event: TraceabilityEvent;
  isLocked: boolean;
  onSelectPrint: (event: TraceabilityEvent) => void;
}) {
  const Icon = EVENT_ICONS[event.type];

  return (
    <li className="relative pl-12">
      <span
        className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-stone-50 ${
          isLocked ? 'bg-amber-600 text-white' : 'bg-emerald-950 text-white'
        }`}
      >
        {isLocked ? <LockKeyhole size={16} /> : <Icon size={16} />}
      </span>

      <article
        className={`rounded-xl border bg-white p-3.5 shadow-sm ${
          isLocked ? 'border-amber-300' : 'border-stone-200'
        }`}
      >
        <header className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          <time className="font-mono text-[10px] text-stone-500">
            {formatTechnicalDate(event.timestamp)}
          </time>
        </header>

        {isLocked ? (
          <div className="mt-2 rounded-lg border border-dashed border-amber-400 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <LockKeyhole size={14} />
              {UI_TEXTS.protectedData}
            </div>
            <div className="mt-2 space-y-1.5" aria-hidden>
              <div className="h-2.5 w-3/4 rounded bg-amber-200/80 blur-[2px]" />
              <div className="h-2.5 w-1/2 rounded bg-amber-200/80 blur-[2px]" />
            </div>
          </div>
        ) : (
          <>
            <h3 className="mt-1 text-sm font-bold text-emerald-950">{event.title}</h3>
            <dl className="mt-2 space-y-1">
              {Object.entries(event.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3 text-xs">
                  <dt className="text-stone-500">{key}</dt>
                  <dd className="text-right font-semibold text-stone-800">{value}</dd>
                </div>
              ))}
            </dl>
            {event.signatures && <SignatureChips signatures={event.signatures} />}
          </>
        )}

        <footer className="mt-3 space-y-1.5 border-t border-stone-100 pt-2.5">
          {event.isOfflinePending ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                <Clock3 size={12} />
                {UI_TEXTS.offlineQueued}
              </span>
              <p className="font-mono text-[11px] text-amber-800">
                sha256: {truncateHash(event.hederaTransactionId)}
              </p>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <BadgeCheck size={12} />
                {UI_TEXTS.hashVerified}
              </span>
              <div>
                <HederaTransactionLink
                  transactionId={event.hederaTransactionId}
                  hashscanUrl={event.hashscanUrl}
                  className="text-[11px]"
                />
              </div>
            </>
          )}
          <p className="font-mono text-[10px] text-stone-400">
            prev: {truncateHash(event.previousHash)}
          </p>
          {!isLocked && (
            <button
              type="button"
              onClick={() => onSelectPrint(event)}
              className="print:hidden mt-1 inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-950 transition hover:bg-emerald-50"
            >
              <Printer size={12} />
              Constancia / Imprimir
            </button>
          )}
        </footer>
      </article>
    </li>
  );
}

export function PassportView() {
  const {
    animalRecord,
    isEventVisible,
    pendingOfflineCount,
    isDemoModified,
    syncOfflineEvents,
    resetDemoData,
  } = useTraceability();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TraceabilityEvent | null>(null);
  const receiptDialogRef = useRef<HTMLDialogElement>(null);

  const openReceipt = (event: TraceabilityEvent) => {
    setSelectedEvent(event);
    receiptDialogRef.current?.showModal();
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    const result = await syncOfflineEvents();
    setIsSyncing(false);

    if (result.synced > 0 && result.failed === 0) {
      setSyncNotice(
        `${result.synced} hito(s) sincronizado(s) y anclado(s) en Hedera HCS.`
      );
    } else if (result.synced > 0 && result.failed > 0) {
      setSyncNotice(
        `Se anclaron ${result.synced} hito(s); ${result.failed} pendiente(s) por demora de red.`
      );
    } else if (result.failed > 0) {
      setSyncNotice(
        'No se pudo conectar con Hedera HCS. Tus eventos siguen resguardados en la DB local.'
      );
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-emerald-950">{VIEW_LABELS.PASSPORT.title}</h2>
        {isDemoModified && (
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              setSyncNotice(null);
            }}
            className="print:hidden inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2 py-1 text-[10px] font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <RotateCcw size={11} />
            {UI_TEXTS.resetDemoLabel}
          </button>
        )}
      </div>

      {pendingOfflineCount > 0 ? (
        <div className="print:hidden mb-4 space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Database size={14} className="shrink-0 text-amber-700" />
              <span>
                {pendingOfflineCount}{' '}
                {pendingOfflineCount === 1
                  ? 'hito en DB Local pendiente de anclaje'
                  : 'hitos en DB Local pendientes de anclaje'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-900 disabled:opacity-70"
          >
            {isSyncing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <RefreshCw size={13} />
            )}
            {isSyncing ? UI_TEXTS.syncingLabel : UI_TEXTS.syncNowLabel}
          </button>
          {syncNotice && <p className="text-[11px] font-medium text-amber-900">{syncNotice}</p>}
        </div>
      ) : (
        <div className="print:hidden mb-4 flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-[11px] font-medium text-emerald-900">
          <span className="inline-flex items-center gap-1.5">
            <Database size={13} className="shrink-0 text-emerald-700" />
            {UI_TEXTS.hybridDbActive}
          </span>
          {syncNotice && (
            <span className="font-semibold text-emerald-700">{syncNotice}</span>
          )}
        </div>
      )}

      <div className="relative">
        <span className="absolute bottom-4 left-[17px] top-4 w-0.5 bg-stone-300" aria-hidden />
        <ol className="relative space-y-4">
          {animalRecord.events.map((event) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLocked={!isEventVisible(event)}
              onSelectPrint={openReceipt}
            />
          ))}
        </ol>
      </div>

      <dialog
        ref={receiptDialogRef}
        aria-labelledby="event-receipt-title"
        {...({ closedby: 'any' } as Record<string, string>)}
        className="m-auto w-[min(92dvw,26rem)] rounded-2xl border border-emerald-800 bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-emerald-950/75"
      >
        {selectedEvent && (
          <div>
            <div className="flex items-center justify-between bg-emerald-950 px-5 py-4 text-white">
              <div>
                <h3 id="event-receipt-title" className="text-sm font-bold">
                  Constancia Sanitaria · Pyporé
                </h3>
                <p className="font-mono text-[11px] text-emerald-300">{animalRecord.caravanaId}</p>
              </div>
              <form method="dialog" className="print:hidden">
                <button
                  type="submit"
                  aria-label="Cerrar constancia"
                  className="rounded-lg p-1 text-emerald-200 hover:bg-emerald-900 hover:text-white"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
            <div className="space-y-3 p-5 text-xs">
              <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
                <QrCode size={48} className="shrink-0 text-emerald-950" />
                <div className="min-w-0">
                  <p className="font-bold text-emerald-950">{selectedEvent.title}</p>
                  <p className="font-mono text-[10px] text-stone-500">
                    {formatTechnicalDate(selectedEvent.timestamp)}
                  </p>
                </div>
              </div>
              <dl className="space-y-1.5 rounded-xl border border-stone-200 p-3">
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-500">RENSPA</dt>
                  <dd className="font-mono font-semibold">{animalRecord.renspa}</dd>
                </div>
                {Object.entries(selectedEvent.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <dt className="text-stone-500">{key}</dt>
                    <dd className="text-right font-semibold">{value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-2 border-t border-stone-100 pt-1.5">
                  <dt className="text-stone-500">Prueba DLT / Hash</dt>
                  <dd className="font-mono font-semibold text-emerald-800">
                    {truncateHash(selectedEvent.hederaTransactionId)}
                  </dd>
                </div>
              </dl>
              {selectedEvent.signatures && <SignatureChips signatures={selectedEvent.signatures} />}
              <div className="print:hidden flex items-center gap-2 pt-1">
                <button
                  type="button"
                  autoFocus
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900"
                >
                  <Printer size={14} />
                  Imprimir / Guardar PDF
                </button>
                <form method="dialog">
                  <button
                    type="submit"
                    className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    Cerrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
