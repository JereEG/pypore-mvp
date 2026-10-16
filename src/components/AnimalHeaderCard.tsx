'use client';

import { MapPin, Nfc, QrCode, ShieldCheck } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { ROLE_CONFIGS, UI_TEXTS } from '@/domain/demoConfig';

export function AnimalHeaderCard() {
  const { animalRecord, currentRole } = useTraceability();

  return (
    <section className="rounded-2xl bg-emerald-950 p-4 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-500/40">
            <ShieldCheck size={12} />
            {UI_TEXTS.sovereignIdentity}
          </span>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-emerald-300/70">Caravana</p>
          <p className="font-mono text-2xl font-bold tracking-tight">{animalRecord.caravanaId}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-white p-2 text-emerald-950">
          <QrCode size={52} strokeWidth={1.5} />
          <span className="flex items-center gap-0.5 font-mono text-[9px] font-semibold">
            <Nfc size={10} />
            RFID
          </span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-800 pt-3 text-xs">
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">RENSPA</dt>
          <dd className="font-mono font-semibold">{animalRecord.renspa}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">Raza</dt>
          <dd className="font-semibold">{animalRecord.breed}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">Nacimiento</dt>
          <dd className="font-mono font-semibold">{animalRecord.birthDate}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">Origen</dt>
          <dd className="flex items-center gap-1 font-semibold">
            <MapPin size={12} className="shrink-0 text-emerald-400" />
            {animalRecord.originLocation}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[11px] text-emerald-200/80">
        {animalRecord.ownerName} · Vista: {ROLE_CONFIGS[currentRole].badge}
      </p>
    </section>
  );
}
