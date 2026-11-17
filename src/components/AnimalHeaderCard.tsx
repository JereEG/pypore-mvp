'use client';

import { useRef } from 'react';
import {
  BadgeCheck,
  FileCheck2,
  MapPin,
  Nfc,
  Printer,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { ROLE_CONFIGS, UI_TEXTS } from '@/domain/demoConfig';
import { truncateHash } from '@/lib/format';
import { PyporeLogo } from './PyporeLogo';

export function AnimalHeaderCard() {
  const { animalRecord, availableAnimals, selectAnimal, currentRole } = useTraceability();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOutsideRef = useRef(false);

  const latestEvent = animalRecord.events[animalRecord.events.length - 1];

  const isPointerOutside = (event: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return false;
    }
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  return (
    <>
      <section className="rounded-2xl bg-emerald-950 p-4 text-white shadow-lg">
        {availableAnimals.length > 1 && (
          <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Selector de ejemplar">
            {availableAnimals.map((animal) => {
              const isSelected = animal.caravanaId === animalRecord.caravanaId;
              const isBuffalo = animal.caravanaId.includes('BUF');
              return (
                <button
                  key={animal.caravanaId}
                  type="button"
                  onClick={() => selectAnimal(animal.caravanaId)}
                  aria-pressed={isSelected}
                  className={`flex-1 rounded-lg px-2.5 py-1.5 text-left text-[11px] font-semibold transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-400/50'
                      : 'bg-emerald-900/60 text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
                  }`}
                >
                  <span className="block truncate">
                    {isBuffalo ? 'Búfalo · Punta de Lanza' : 'Bovino · Braford'}
                  </span>
                  <span className="font-mono text-[10px] opacity-85">{animal.caravanaId}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-500/40">
              <ShieldCheck size={12} />
              {UI_TEXTS.sovereignIdentity}
            </span>
            {animalRecord.categoryBadge && (
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {animalRecord.categoryBadge}
              </p>
            )}
            <p className="mt-1.5 text-[10px] uppercase tracking-widest text-emerald-300/70">
              Caravana Electrónica
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight">{animalRecord.caravanaId}</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            aria-label="Abrir certificado QR y guía DTA para imprimir"
            className="group flex shrink-0 flex-col items-center gap-1 rounded-xl bg-white p-2 text-emerald-950 shadow transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <QrCode size={52} strokeWidth={1.5} className="transition group-hover:scale-105" />
            <span className="flex items-center gap-0.5 font-mono text-[9px] font-bold text-emerald-800">
              <Nfc size={10} />
              VER QR · DTA
            </span>
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-800 pt-3 text-xs">
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">RENSPA</dt>
            <dd className="font-mono font-semibold">{animalRecord.renspa}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">
              Especie / Raza
            </dt>
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

      <dialog
        ref={dialogRef}
        aria-labelledby="qr-dta-dialog-title"
        {...({ closedby: 'any' } as Record<string, string>)}
        onPointerDown={(event) => {
          if (!('closedBy' in HTMLDialogElement.prototype)) {
            pressedOutsideRef.current = isPointerOutside(event);
          }
        }}
        onPointerUp={(event) => {
          if (
            !('closedBy' in HTMLDialogElement.prototype) &&
            pressedOutsideRef.current &&
            isPointerOutside(event)
          ) {
            dialogRef.current?.close();
          }
          pressedOutsideRef.current = false;
        }}
        className="m-auto w-[min(92dvw,26rem)] rounded-2xl border border-emerald-800 bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-emerald-950/75 backdrop:backdrop-blur-xs"
      >
        <div className="bg-emerald-950 px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <PyporeLogo size={32} className="shrink-0" />
              <div>
                <h2 id="qr-dta-dialog-title" className="text-sm font-bold tracking-tight">
                  Control Instantáneo QR &amp; Guía DTA
                </h2>
                <p className="text-[11px] text-emerald-300/80">
                  Auditoría en ruta, Prefectura y Frigoríficos
                </p>
              </div>
            </div>
            <form method="dialog">
              <button
                type="submit"
                aria-label="Cerrar certificado"
                className="rounded-lg p-1.5 text-emerald-200 transition hover:bg-emerald-900 hover:text-white"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="rounded-lg bg-white p-2 text-emerald-950 shadow-sm ring-1 ring-stone-200">
              <QrCode size={72} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <BadgeCheck size={12} />
                HCS Verificado · EUDR Ready
              </span>
              <p className="font-mono text-lg font-bold text-emerald-950">
                {animalRecord.caravanaId}
              </p>
              <p className="text-xs font-medium text-stone-600">{animalRecord.breed}</p>
            </div>
          </div>

          <dl className="space-y-2 rounded-xl border border-stone-200 p-3.5 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-stone-500">RENSPA</dt>
              <dd className="font-mono font-semibold text-stone-900">{animalRecord.renspa}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-stone-500">Origen</dt>
              <dd className="text-right font-semibold text-stone-900">
                {animalRecord.originLocation}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-stone-500">Eventos Sellados</dt>
              <dd className="font-mono font-semibold text-emerald-700">
                {animalRecord.events.length} hitos encadenados
              </dd>
            </div>
            {latestEvent && (
              <div className="flex justify-between gap-2 border-t border-stone-100 pt-2">
                <dt className="text-stone-500">Último Hash DLT</dt>
                <dd className="font-mono font-semibold text-emerald-800">
                  {truncateHash(latestEvent.hederaTransactionId)}
                </dd>
              </div>
            )}
          </dl>

          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
            <FileCheck2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />
            <p className="leading-relaxed">
              Triple Firma Verificable activa: Productor titular + Veterinario matriculado +
              Control sanitario, respetando la política de soberanía ({ROLE_CONFIGS[currentRole].shortLabel}).
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              autoFocus
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-900"
            >
              <Printer size={15} />
              Imprimir Certificado / DTA
            </button>
            <form method="dialog">
              <button
                type="submit"
                className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
