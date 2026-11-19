import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Compass,
  Database,
  DollarSign,
  ExternalLink,
  FileCheck2,
  History,
  Layers,
  LockKeyhole,
  MapPin,
  Nfc,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  WifiOff,
} from 'lucide-react';
import { PyporeLogo } from '@/components/PyporeLogo';

const SURVEY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSd419is2k4tu-KyCy5eR0_-39IjQlauDxjSDkRLw-7RTNm5hg/viewform';

const NAV_LINKS = [
  { href: '#bufalo', label: 'Búfalo' },
  { href: '#inversion', label: 'Capital' },
  { href: '#problema', label: 'Problema' },
  { href: '#objetivo', label: 'Objetivo' },
  { href: '#historia', label: 'Historia' },
  { href: '#valores', label: 'Valores' },
  { href: '#equipo', label: 'Equipo' },
];

const BUFFALO_ADVANTAGES = [
  {
    badge: 'EUDR Nativo · 0% Desmonte',
    title: 'Humedales Certificados sin Deforestación',
    description:
      'El búfalo produce en esteros, bañados y pastizales naturales del NEA donde no existe deforestación, obteniendo cumplimiento directo frente a la exigencia europea EUDR.',
    icon: Sprout,
  },
  {
    badge: 'Ventaja Biológica y Sanitaria',
    title: 'Resistencia Natural y Triple Propósito',
    description:
      'Menor carga parasitaria de garrapata, conversión superior en campos bajos y alto valor agregado en carne magra premium, leche A2 para mozzarella y cuero trazado.',
    icon: ShieldCheck,
  },
  {
    badge: 'Beachhead Market Concentrado',
    title: 'Corrientes y NEA: Epicentro Nacional',
    description:
      'La región concentra el mayor rodeo bubalino de Argentina (~200.000 cabezas), permitiendo validar con productores líderes antes de escalar a todo el rodeo bovino.',
    icon: MapPin,
  },
];

const CAPITAL_METRICS = [
  {
    metric: '$0.0001 USD',
    label: 'Costo fijo por anclaje en Hedera HCS',
    detail: 'Solo sellamos pruebas criptográficas en Hedera; la operación diaria corre en DB tradicional.',
    icon: DollarSign,
  },
  {
    metric: 'Dic 2026',
    label: 'Ventana Regulatoria EUDR + Caravana',
    detail: 'Demanda inelástica por trazabilidad exportadora y caravana electrónica oficial.',
    icon: TrendingUp,
  },
  {
    metric: '200K → 52M+',
    label: 'De Búfalos NEA a Rodeo Bovino Mercosur',
    detail: 'Arquitectura agnóstica de especie: conquista el nicho bubalino y escala a todo el agro.',
    icon: Layers,
  },
  {
    metric: 'B2B2C',
    label: 'SaaS Establecimiento + Fee Frigorífico',
    detail: 'Doble motor de ingresos: abono por campo y auditoría instantánea por lote exportado.',
    icon: BarChart3,
  },
];

const HYBRID_ARCHITECTURE = [
  {
    layer: 'Capa Operativa & Privada',
    title: 'Base de Datos Tradicional de Alta Velocidad',
    description:
      'Almacena la operación diaria del establecimiento, métricas comerciales privadas, cola de sincronización offline en el corral y reglas de visibilidad por rol. Consultas instantáneas sin exponer secretos del productor en una red pública.',
    icon: Database,
  },
  {
    layer: 'Fuente de Verdad Inmutable',
    title: 'Hedera Consensus Service (HCS)',
    description:
      'Ancla el hash criptográfico, las firmas del productor y veterinario y el timestamp público verificable de cada hito. Garantiza matemáticamente que ningún registro de la base operativa fue alterado retroactivamente.',
    icon: ShieldCheck,
  },
];

const META_PILLARS = [
  {
    step: '01',
    title: 'Triple Firma Verificable',
    description:
      'El productor declara el hecho, el veterinario matriculado certifica la sanidad y el organismo valida, deslindando responsabilidades sobre datos firmados.',
    icon: FileCheck2,
  },
  {
    step: '02',
    title: 'Soberanía de Datos',
    description:
      'El productor elige con un interruptor qué datos privados ocultar frente a terceros.',
    icon: ShieldHalf,
  },
  {
    step: '03',
    title: 'Control Instantáneo por QR',
    description:
      'Frigoríficos y controles en ruta o Prefectura auditan el lote en segundos escaneando un código sellado en Hedera.',
    icon: QrCode,
  },
];

const CORE_VALUES = [
  {
    title: 'Soberanía del Productor',
    description:
      'Quien trabaja la tierra es el único dueño de su información comercial y patrimonial.',
    icon: LockKeyhole,
  },
  {
    title: 'Confianza Matemática',
    description:
      'No pedimos fe ciega; sellamos cada hito con firmas digitales y consenso inmutable.',
    icon: BadgeCheck,
  },
  {
    title: 'Realidad de Trinchera',
    description:
      'Diseñamos para el barro, la falta de conectividad y la simplicidad operativa en el corral.',
    icon: WifiOff,
  },
  {
    title: 'Innovación Abierta',
    description:
      'Un desarrollo técnico solo se transforma en innovación cuando la comunidad productiva se apropia de él.',
    icon: Sparkles,
  },
];

interface TeamMember {
  name: string;
  role: string;
  badge: string;
  description: string;
  linkedinUrl: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Jeremías Ezequiel González',
    role: 'Fundador & Lead Software Engineer',
    badge: 'FaCENA · UNNE',
    description:
      'Analista Programador Universitario finalizando Lic. en Sistemas de Información (FaCENA - UNNE). Especialista en arquitectura Full Stack, Mobile (React Native) y soluciones Web3 / On-Chain en Hedera.',
    linkedinUrl: 'https://www.linkedin.com/in/jereeg',
  },
  {
    name: 'Belén García Moyanesi',
    role: 'Project Management & Análisis Funcional',
    badge: 'UTN FRRe · ICCTI',
    description:
      'Estudiante avanzada de Ingeniería en Sistemas (UTN FRRe), Project Manager en ICCTI y Coach Ontológico organizacional. Experiencia en análisis funcional y representación en IEEE Argentina.',
    linkedinUrl: 'https://www.linkedin.com/in/belenmoyanesi',
  },
  {
    name: 'Facundo Matías Cubells Romero',
    role: 'Agentes de IA & Automatización de Procesos',
    badge: 'UTN FRRe · ClickArg',
    description:
      'Formación en Ingeniería en Sistemas (UTN FRRe), fundador de ClickArg y voluntario en IEEE y Rotary. Especialista en rediseño de flujos, agentes de IA y escalamiento comercial.',
    linkedinUrl: 'https://www.linkedin.com/in/facundo-cubells',
  },
  {
    name: 'Luciana Belén Canteros',
    role: 'Ciencia de Datos & Modelos de IA (LLMs)',
    badge: 'FaCENA · UNNE',
    description:
      'Analista Programadora Universitaria y Diplomada en Ciencia de Datos (UNNE). Data Scientist en SEGEM con experiencia en Python, LLMs e investigación presentada en las 55° JAIIO (SADIO).',
    linkedinUrl: 'https://www.linkedin.com/in/luciana-belen-canteros-729513318',
  },
];

function TickCounterArtwork() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tickBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#tickBg)" />
      <g stroke="#10b981" strokeOpacity="0.18" strokeWidth="1">
        <line x1="0" y1="45" x2="400" y2="45" />
        <line x1="0" y1="90" x2="400" y2="90" />
        <line x1="0" y1="135" x2="400" y2="135" />
        <line x1="0" y1="180" x2="400" y2="180" />
        <line x1="80" y1="0" x2="80" y2="225" />
        <line x1="160" y1="0" x2="160" y2="225" />
        <line x1="240" y1="0" x2="240" y2="225" />
        <line x1="320" y1="0" x2="320" y2="225" />
      </g>
      <circle cx="200" cy="112" r="76" fill="#022c22" fillOpacity="0.7" stroke="#34d399" strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="200" cy="112" r="56" stroke="#10b981" strokeOpacity="0.35" strokeDasharray="4 4" strokeWidth="1.5" />
      <ellipse cx="176" cy="96" rx="11" ry="8" transform="rotate(-18 176 96)" fill="#fbbf24" fillOpacity="0.85" />
      <ellipse cx="218" cy="92" rx="10" ry="7" transform="rotate(24 218 92)" fill="#fbbf24" fillOpacity="0.85" />
      <ellipse cx="195" cy="128" rx="12" ry="8" transform="rotate(8 195 128)" fill="#fbbf24" fillOpacity="0.85" />
      <ellipse cx="228" cy="126" rx="9" ry="7" transform="rotate(-28 228 126)" fill="#fbbf24" fillOpacity="0.85" />
      <rect x="158" y="80" width="36" height="32" rx="4" stroke="#34d399" strokeWidth="2" fill="none" />
      <rect x="202" y="76" width="32" height="30" rx="4" stroke="#34d399" strokeWidth="2" fill="none" />
      <rect x="177" y="114" width="36" height="28" rx="4" stroke="#34d399" strokeWidth="2" fill="none" />
      <rect x="213" y="112" width="30" height="28" rx="4" stroke="#34d399" strokeWidth="2" fill="none" />
      <rect x="22" y="20" width="142" height="26" rx="6" fill="#064e3b" stroke="#34d399" strokeOpacity="0.45" />
      <text x="34" y="37" fill="#a7f3d0" fontSize="10" fontFamily="monospace" fontWeight="bold">
        CONTEO IA · AÑO CERO
      </text>
      <rect x="254" y="178" width="124" height="26" rx="6" fill="#022c22" stroke="#fbbf24" strokeOpacity="0.55" />
      <text x="266" y="195" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
        HUEVOS: 4 DETECTADOS
      </text>
    </svg>
  );
}

const HISTORY_MILESTONES = [
  {
    period: 'Año Cero · Origen Sanitario',
    title: 'Automatización del Conteo de Huevos de Garrapata',
    description:
      'Resolución desde el código de problemas sanitarios concretos en el campo correntino para proteger la sanidad del rodeo.',
    badge: 'Trinchera & Sanidad Animal',
    artwork: 'tick',
  },
  {
    period: 'Actualidad · NEA TECH 2026',
    title: '1° Puesto Track Internacional de Hedera',
    description:
      'Reconocimiento a la arquitectura de Pasaporte Digital Ganadero con soberanía del productor y sellado inmutable en Hedera Consensus Service.',
    badge: 'Consenso DLT & Proyección Global',
    artwork: 'award',
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-emerald-950 text-stone-100 flex flex-col selection:bg-emerald-500 selection:text-emerald-950">
      <header className="sticky top-0 z-40 border-b border-emerald-800/80 bg-emerald-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="group flex items-center gap-2.5">
              <PyporeLogo
                size={38}
                className="shrink-0 shadow-md transition group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white">
                  Pyporé{' '}
                  <span className="font-normal text-emerald-300/80">(Huella Propia)</span>
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30">
              <Award size={12} className="shrink-0 text-amber-400" />
              1° Puesto Track Hedera — Ideathon NEA TECH 2026
            </span>
          </div>

          <nav aria-label="Navegación principal" className="hidden xl:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-emerald-200/80 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Link
            href="/demo"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500"
          >
            <span>Probar Demo en Vivo</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <nav
          aria-label="Secciones de la página"
          className="flex xl:hidden items-center gap-2 overflow-x-auto border-t border-emerald-900/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/80"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-lg bg-emerald-900/50 px-3 py-1 transition hover:bg-emerald-800 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-emerald-900/80 py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-emerald-600/20 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/40">
                  <ShieldCheck size={14} />
                  <span>Punta de Lanza: Búfalo del NEA · Hedera Consensus Service (HCS)</span>
                </div>

                <h1 className="text-[clamp(1.85rem,1.2rem+2.5vw,3.35rem)] font-bold leading-[1.12] tracking-tight text-white">
                  Trazabilidad ganadera inmutable: del humedal bubalino correntino a los mercados
                  más exigentes del mundo.
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-emerald-100/85 sm:text-lg">
                  Arrancamos en la producción bubalina (Búfalo de Agua) en Corrientes y el NEA como
                  punta de lanza hacia toda la ganadería de exportación. Un Pasaporte Digital con
                  soberanía de datos conectado a Hedera Consensus Service (HCS) para demostrar
                  sanidad y origen libre de deforestación (EUDR) sin regalar tu privacidad fiscal.
                </p>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500"
                  >
                    <span>Explorar Demo Interactiva</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href={SURVEY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/60 bg-emerald-900/40 px-5 py-3.5 text-sm font-bold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-900/80 hover:text-white"
                  >
                    <span>Dar Golpe de Realidad (Encuesta Anónima)</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-emerald-800 bg-emerald-900/35 p-5 shadow-2xl ring-1 ring-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300 ring-1 ring-amber-400/40">
                        <ShieldCheck size={12} />
                        Pasaporte Digital Bubalino
                      </span>
                      <p className="mt-3 text-[10px] uppercase tracking-widest text-emerald-300/70">
                        Caravana Electrónica · Búfalo
                      </p>
                      <p className="font-mono text-2xl font-bold tracking-tight text-white">
                        AR-05-BUF-0108
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-white p-2.5 text-emerald-950 shadow">
                      <QrCode size={52} strokeWidth={1.5} />
                      <span className="flex items-center gap-0.5 font-mono text-[9px] font-semibold">
                        <Nfc size={10} />
                        RFID
                      </span>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-800/80 pt-3.5 text-xs">
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                        RENSPA
                      </dt>
                      <dd className="font-mono font-semibold text-white">04.015.0.08842/01</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                        Especie / Raza
                      </dt>
                      <dd className="font-semibold text-white">Búfalo Mediterráneo</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                        Estatus EUDR
                      </dt>
                      <dd className="font-mono font-semibold text-emerald-300">
                        Humedal · 0% Desmonte
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-emerald-300/70">
                        Origen
                      </dt>
                      <dd className="flex items-center gap-1 font-semibold text-white">
                        <MapPin size={12} className="shrink-0 text-emerald-400" />
                        Esteros del Iberá, Ctes.
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-800/90 bg-emerald-950/80 px-3.5 py-2.5 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                      <BadgeCheck size={14} />
                      Hedera HCS Verificado
                    </span>
                    <Link
                      href="/demo"
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-400 hover:underline"
                    >
                      Abrir simulador bubalino
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="bufalo"
          className="border-b border-emerald-900/80 bg-emerald-950 py-16 text-white sm:py-20"
        >
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 ring-1 ring-amber-400/30">
                <Sprout size={13} />
                Estrategia Beachhead · Caballo de Troya
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Por qué arrancamos en el Búfalo para conquistar la ganadería de exportación
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-100/85 sm:text-base">
                En lugar de competir de entrada en un mercado bovino fragmentado, ingresamos por
                el nicho de mayor crecimiento exportador y ventaja ambiental del NEA: el Búfalo de
                Agua en Corrientes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {BUFFALO_ADVANTAGES.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="flex flex-col justify-between rounded-2xl border border-emerald-800 bg-emerald-900/35 p-6 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/25 text-emerald-300 ring-1 ring-emerald-500/40">
                          <Icon size={20} />
                        </span>
                        <span className="rounded-full bg-emerald-950 px-2.5 py-1 font-mono text-[10px] font-semibold text-amber-300 ring-1 ring-emerald-800">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div
              id="inversion"
              className="rounded-2xl border border-amber-400/40 bg-emerald-900/25 p-6 shadow-2xl sm:p-8 lg:p-10"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-emerald-800/80 pb-6 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/40">
                    <TrendingUp size={13} />
                    Tesis de Inversión &amp; Unit Economics
                  </span>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Diseñado para ser irresistible al capital inteligente
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
                    Regulación obligatoria con fecha límite, costo criptográfico cercano a cero y
                    una ruta clara de expansión desde el rodeo bubalino del NEA hacia todo el
                    rodeo bovino del Mercosur.
                  </p>
                </div>

                <Link
                  href="/demo"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-emerald-950 shadow-lg transition hover:bg-amber-400"
                >
                  <span>Auditar Producto en Vivo</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {CAPITAL_METRICS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-emerald-800/90 bg-emerald-950/75 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xl font-bold text-amber-400">
                          {item.metric}
                        </span>
                        <Icon size={18} className="text-emerald-400" />
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-white">{item.label}</h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/75">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-5 border-t border-emerald-800/80 pt-6 md:grid-cols-2">
                {HYBRID_ARCHITECTURE.map((arch) => {
                  const Icon = arch.icon;
                  return (
                    <div
                      key={arch.title}
                      className="flex items-start gap-4 rounded-xl border border-emerald-700/60 bg-emerald-950/60 p-5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-500/40">
                        <Icon size={20} />
                      </span>
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
                          {arch.layer}
                        </span>
                        <h4 className="mt-1 text-sm font-bold text-white">{arch.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/80">
                          {arch.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-stone-100 py-16 text-stone-900 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <article
                id="problema"
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 ring-1 ring-amber-500/30">
                    <ShieldAlert size={13} />
                    Diagnóstico de Campo
                  </span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-emerald-950">
                    El Problema
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                    Desde diciembre de 2026 la Unión Europea (Reglamento EUDR) exige demostrar
                    origen y trazabilidad inalterable para no frenar compras de carne, sumado a la
                    identificación electrónica obligatoria en Argentina. Hoy los datos están
                    dispersos en papeles adulterables y las plataformas centralizadas generan
                    rechazo porque obligan al productor a entregar información privada.
                  </p>
                </div>
                <div className="mt-6 border-t border-stone-100 pt-4 font-mono text-xs text-stone-500">
                  Exigencia EUDR + Trazabilidad Electrónica Nacional
                </div>
              </article>

              <article
                id="objetivo"
                className="flex flex-col justify-between rounded-2xl border border-emerald-800 bg-emerald-950 p-6 text-white shadow-lg sm:p-8"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/40">
                    <Target size={13} />
                    Propósito Operativo
                  </span>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                    Nuestro Objetivo
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-emerald-100/85 sm:text-base">
                    Que desde el productor más pequeño sin señal en el monte hasta el frigorífico
                    exportador puedan registrar y verificar eventos sanitarios sin fricción,
                    generando además la documentación lista para imprimir para evitar el doble
                    trabajo.
                  </p>
                </div>
                <div className="mt-6 border-t border-emerald-800/80 pt-4 font-mono text-xs text-emerald-300/80">
                  Cero fricción operativa · Sin doble carga administrativa
                </div>
              </article>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  <Compass size={13} />
                  Visión Regional
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                  Nuestra Meta
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
                  Consolidar desde Corrientes y el NEA el estándar abierto de confianza
                  agropecuaria basado en tres pilares:
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {META_PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.step}
                      className="rounded-xl border border-stone-200 bg-stone-50 p-5 transition hover:border-emerald-600/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-300">
                          <Icon size={20} />
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          PILAR {pillar.step}
                        </span>
                      </div>
                      <h3 className="mt-4 text-base font-bold text-emerald-950">{pillar.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="historia"
          className="border-y border-emerald-900/80 bg-emerald-950 py-16 text-white sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-2xl border border-emerald-800 bg-emerald-900/30 p-6 shadow-xl sm:p-10">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-300 ring-1 ring-amber-400/30">
                  <History size={13} />
                  Compromiso real con el agro
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Nuestra Historia
                </h2>
                <p className="mt-4 text-base leading-relaxed text-emerald-100/90 sm:text-lg">
                  Pyporé es el resultado de años buscando aplicar tecnología a los dolores reales del
                  campo en nuestra región. Ese camino empezó años atrás intentando resolver desde el
                  código problemas sanitarios concretos —como la automatización del conteo de huevos
                  de garrapata para proteger al ganado— y evolucionó hasta convertirse hoy en una
                  arquitectura de trazabilidad inmutable premiada con el 1° Puesto en el Track
                  Internacional de Hedera en el NEA TECH 2026.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {HISTORY_MILESTONES.map((milestone) => (
                  <article
                    key={milestone.period}
                    className="flex flex-col overflow-hidden rounded-2xl border border-emerald-800/90 bg-emerald-950/70 shadow-lg"
                  >
                    <div className="aspect-video w-full overflow-hidden border-b border-emerald-800/80 bg-emerald-950">
                      {milestone.artwork === 'tick' ? (
                        <TickCounterArtwork />
                      ) : (
                        <Image
                          src="/images/hito-premio-hedera.jpg"
                          alt="Premiación 1° Puesto Track Hedera en NEA TECH 2026 - Pyporé"
                          width={1024}
                          height={768}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            {milestone.period}
                          </span>
                          <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                            {milestone.badge}
                          </span>
                        </div>
                        <h3 className="mt-2.5 text-lg font-bold text-white">{milestone.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="valores" className="bg-stone-100 py-16 text-stone-900 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                <ShieldCheck size={13} />
                Principios de Diseño
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                Nuestros Valores
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CORE_VALUES.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-600/50"
                  >
                    <div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-300">
                        <Icon size={20} />
                      </span>
                      <h3 className="mt-4 text-base font-bold text-emerald-950">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="equipo" className="bg-emerald-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/40">
                <Users size={13} />
                Equipo Fundador (UNNE + UTN FRRe) + Convocatoria Abierta
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Quiénes Somos
              </h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_MEMBERS.map((member) => (
                <article
                  key={member.name}
                  className="flex flex-col justify-between rounded-2xl border border-emerald-800 bg-emerald-900/35 p-6 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/25 text-emerald-300 ring-1 ring-emerald-500/40">
                        <UserCheck size={22} />
                      </span>
                      <span className="rounded-full bg-emerald-950 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-800">
                        {member.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">{member.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      {member.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">
                      {member.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-emerald-800/70 pt-3">
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 transition hover:text-white"
                    >
                      <span>Perfil de LinkedIn</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <article className="mt-6 flex flex-col justify-between gap-6 rounded-2xl border-2 border-dashed border-amber-400/60 bg-emerald-900/20 p-6 shadow-lg transition hover:border-amber-400 hover:bg-emerald-900/40 md:flex-row md:items-center">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40">
                  <Users size={22} />
                </span>
                <div>
                  <span className="inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30">
                    Convocatoria Activa
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    Búsqueda Abierta — Aliados del Agro &amp; Co-equipers
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-emerald-100/85">
                    Buscamos veterinarios, productores, referentes agroindustriales y talentos
                    técnicos que quieran sumarse a validar y escalar esta solución en el campo.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href={SURVEY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-emerald-950 shadow transition hover:bg-amber-400 md:w-auto"
                >
                  <span>Sumarme / Completar Formulario</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-900 bg-emerald-950 py-10 text-emerald-200/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <PyporeLogo size={26} className="shrink-0" />
            <p className="text-center text-xs font-medium sm:text-left">
              Desarrollado en Corrientes, Argentina — Pyporé (Huella Propia) 2026
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-900/60 px-3.5 py-2 text-emerald-200 transition hover:bg-emerald-800 hover:text-white"
            >
              <span>Ir a la Demo (/demo)</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/ruta"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800 px-3.5 py-2 text-emerald-200 transition hover:border-emerald-600 hover:text-white"
            >
              <span>Ruta IoT &amp; Caja Negra (/ruta)</span>
              <ArrowRight size={13} />
            </Link>

            <a
              href={SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800 px-3.5 py-2 text-emerald-200 transition hover:border-emerald-600 hover:text-white"
            >
              <span>Formulario Anónimo de Validación</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
