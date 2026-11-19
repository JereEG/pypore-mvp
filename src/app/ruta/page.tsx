import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Cpu,
  Database,
  LockKeyhole,
  MapPin,
  Nfc,
  Radio,
  Route,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { PyporeLogo } from '@/components/PyporeLogo';

export const metadata: Metadata = {
  title: 'Ruta IoT, Caja Negra & TelePASE · Pyporé',
  description:
    'Arquitectura evolutiva de Pyporé: LoRa, ESP32, NFC/RFID, TelePASE en ruta, Caja Negra criptográfica, DB Tradicional y Hedera HCS hacia Europa (EUDR).',
};

const PIPELINE_STAGES = [
  {
    phase: 'FASE 1 · CAMPO & CORRAL',
    title: 'Sensores LoRa + ESP32 + Caravana NFC/RFID',
    description:
      'Captura en el potrero correntino sin depender de señal celular: identidad NFC/QR por ejemplar, GPS de origen, temperatura y humedad ambiental enviados vía LoRa hacia el gateway del establecimiento.',
    tags: ['ESP32 + LoRa', 'NFC / RFID / QR', 'Cero Deforestación EUDR'],
    icon: Radio,
  },
  {
    phase: 'FASE 2 · TRÁNSITO EN RUTA',
    title: 'Caja Negra Vehicular + Hitos TelePASE',
    description:
      'El camión sale del campo con una Caja Negra sellada que registra GPS continuo, temperatura, apertura de carga y paso automático por peajes TelePASE (hora, ubicación y patente) como evidencia logística.',
    tags: ['TelePASE Automático', 'Caja Negra Firmada', 'Escaneo Visual al Pasado'],
    icon: Truck,
  },
  {
    phase: 'FASE 3 · VERDAD & EXPORTACIÓN',
    title: 'DB Tradicional + Hedera HCS → Europa',
    description:
      'La Base de Datos Tradicional gestiona la operación rápida y la privacidad comercial, mientras Hedera Consensus Service (HCS) ancla el hash inmutable de cada hito para auditoría inmediata de compradores europeos.',
    tags: ['DB Tradicional Privada', 'Hedera HCS ($0.0001)', 'Garantes & Prestigio'],
    icon: ShieldCheck,
  },
];

const BLACKBOX_SPEC = [
  {
    title: 'Telemetría & Tránsito',
    detail: 'GPS continuo, cruces por TelePASE (patente/peaje/hora) y apertura de compuertas.',
    icon: MapPin,
  },
  {
    title: 'Identidad de Hardware',
    detail: 'Cada paquete lleva ID del nodo ESP32/gateway, timestamp y firma criptográfica.',
    icon: Cpu,
  },
  {
    title: 'Detección de Alteraciones',
    detail: 'Encadenamiento SHA-256 local que delata cualquier manipulación antes de llegar a destino.',
    icon: LockKeyhole,
  },
  {
    title: 'Privacidad Empresarial',
    detail: 'Datos comerciales sensibles en DB tradicional; solo pruebas verificables en red pública.',
    icon: Database,
  },
];

export default function RoadmapIoTPage() {
  return (
    <div className="min-h-dvh bg-emerald-950 text-stone-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-emerald-800/80 bg-emerald-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <PyporeLogo size={34} className="shrink-0 transition group-hover:scale-105" />
            <span className="text-sm font-bold tracking-tight text-white sm:text-base">
              Pyporé <span className="font-normal text-emerald-300/80">· Ruta IoT &amp; Exportación</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-800 px-3.5 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-900 hover:text-white"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-emerald-500"
            >
              <span>Probar Demo</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          <section className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 ring-1 ring-amber-400/30">
              <Route size={13} />
              Hoja de Ruta Técnica · Corrientes → Europa
            </span>
            <h1 className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
              De LoRa, NFC y TelePASE a la Caja Negra de Exportación
            </h1>
            <p className="text-sm leading-relaxed text-emerald-100/85 sm:text-base">
              Arquitectura evolutiva diseñada para conectar el monitoreo rural en Corrientes con la
              auditoría sanitaria y logística exigida por compradores europeos (EUDR), garantizando
              seguridad, garantes verificables y prestigio comercial.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {PIPELINE_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <article
                  key={stage.phase}
                  className="flex flex-col justify-between rounded-2xl border border-emerald-800 bg-emerald-900/35 p-6 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/25 text-emerald-300 ring-1 ring-emerald-500/40">
                        <Icon size={20} />
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {stage.phase}
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-white">{stage.title}</h2>
                    <p className="mt-2 text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
                      {stage.description}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-emerald-800/70 pt-4">
                    {stage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-emerald-950 px-2 py-1 font-mono text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>

          <section className="rounded-2xl border border-amber-400/40 bg-emerald-900/25 p-6 shadow-xl sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-emerald-800/80 pb-6 sm:flex-row sm:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/40">
                  <Nfc size={13} />
                  Todo por la Caja Negra
                </span>
                <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                  Estándar de Evidencia, Seguridad y Garantes
                </h2>
              </div>
              <Link
                href="/demo"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-emerald-950 transition hover:bg-amber-400"
              >
                <span>Ver Simulador Actual (/demo)</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BLACKBOX_SPEC.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-emerald-800/90 bg-emerald-950/75 p-4"
                  >
                    <Icon size={18} className="text-amber-400" />
                    <h3 className="mt-2.5 text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/80">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-emerald-900 bg-emerald-950 py-8 text-emerald-200/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <BadgeCheck size={14} className="text-emerald-400" />
            Pyporé (Huella Propia) · Arquitectura IoT + DB Tradicional + Hedera HCS
          </span>
          <Link href="/" className="text-xs font-semibold text-emerald-300 hover:text-white">
            Volver a la Landing Institucional
          </Link>
        </div>
      </footer>
    </div>
  );
}
