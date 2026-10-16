'use client';

import {
  BadgeCheck,
  Baby,
  Link2,
  LockKeyhole,
  LucideIcon,
  Scale,
  Syringe,
  Truck,
} from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { EVENT_TYPE_LABELS, UI_TEXTS, VIEW_LABELS } from '@/domain/demoConfig';
import { EventType, TraceabilityEvent } from '@/domain/traceability';
import { formatTechnicalDate, truncateHash } from '@/lib/format';

const EVENT_ICONS: Record<EventType, LucideIcon> = {
  NACIMIENTO: Baby,
  VACUNACION: Syringe,
  PESAJE: Scale,
  TRASLADO: Truck,
};

function TimelineEvent({ event, isLocked }: { event: TraceabilityEvent; isLocked: boolean }) {
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
          </>
        )}

        <footer className="mt-3 space-y-1.5 border-t border-stone-100 pt-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <BadgeCheck size={12} />
            {UI_TEXTS.hashVerified}
          </span>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600">
            <Link2 size={11} className="shrink-0 text-emerald-600" />
            {truncateHash(event.signatureHash)}
          </p>
          <p className="font-mono text-[10px] text-stone-400">
            prev: {truncateHash(event.previousHash)}
          </p>
        </footer>
      </article>
    </li>
  );
}

export function PassportView() {
  const { animalRecord, isEventVisible } = useTraceability();

  return (
    <section>
      <h2 className="mb-4 text-base font-bold text-emerald-950">{VIEW_LABELS.PASSPORT.title}</h2>
      <div className="relative">
        <span className="absolute bottom-4 left-[17px] top-4 w-0.5 bg-stone-300" aria-hidden />
        <ol className="relative space-y-4">
          {animalRecord.events.map((event) => (
            <TimelineEvent key={event.id} event={event} isLocked={!isEventVisible(event)} />
          ))}
        </ol>
      </div>
    </section>
  );
}
