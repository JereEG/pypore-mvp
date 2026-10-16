'use client';

import { LockKeyhole, ShieldHalf } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import {
  SOVEREIGNTY_POLICY_CONFIGS,
  UI_TEXTS,
  VIEW_LABELS,
} from '@/domain/demoConfig';
import { SovereigntyPolicyKey } from '@/domain/traceability';

const POLICY_ORDER: SovereigntyPolicyKey[] = [
  'shareSanitaryHistory',
  'shareWeightMetrics',
  'shareExactLocation',
  'shareGeneticData',
];

export function SovereigntyView() {
  const { animalRecord, currentRole, toggleSovereigntyPolicy } = useTraceability();

  if (currentRole !== 'PRODUCER') {
    return (
      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center">
        <LockKeyhole size={32} className="mx-auto text-amber-600" />
        <h2 className="mt-3 text-base font-bold text-amber-800">{UI_TEXTS.producerOnlyTitle}</h2>
        <p className="mt-1 text-sm text-amber-700">{UI_TEXTS.producerOnlyBody}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-emerald-950">
        <ShieldHalf size={18} className="text-amber-600" />
        {VIEW_LABELS.SOVEREIGNTY.title}
      </h2>
      <ul className="space-y-3">
        {POLICY_ORDER.map((key) => {
          const config = SOVEREIGNTY_POLICY_CONFIGS[key];
          const isShared = animalRecord.sovereigntyPolicy[key];
          return (
            <li
              key={key}
              className={`rounded-xl border bg-white p-4 shadow-sm transition ${
                isShared ? 'border-emerald-200' : 'border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">{config.label}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isShared ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {isShared ? UI_TEXTS.sharingOn : UI_TEXTS.sharingOff}
                  </span>
                </div>
                <button
                  role="switch"
                  aria-checked={isShared}
                  aria-label={config.label}
                  onClick={() => toggleSovereigntyPolicy(key)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    isShared ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                      isShared ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-xs text-stone-600">{config.description}</p>
              <p className="mt-1.5 text-xs font-medium text-stone-800">{config.impact}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
