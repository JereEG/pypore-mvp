'use client';

import { Eye } from 'lucide-react';
import { useTraceability } from '@/context/TraceabilityContext';
import { ROLE_CONFIGS, UI_TEXTS } from '@/domain/demoConfig';
import { ViewerRole } from '@/domain/traceability';

const ROLE_ORDER: ViewerRole[] = ['PRODUCER', 'AUDITOR_SENASA', 'FRIGORIFICO'];

export function RoleSimulatorBanner() {
  const { currentRole, setCurrentRole } = useTraceability();

  return (
    <div className="sticky top-0 z-30 bg-emerald-950 px-3 pt-2.5 pb-3 shadow-md">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
        <Eye size={12} />
        {UI_TEXTS.simulatorTitle}
      </div>
      <div role="tablist" className="grid grid-cols-3 gap-1 rounded-lg bg-emerald-900/60 p-1">
        {ROLE_ORDER.map((role) => {
          const isActive = role === currentRole;
          return (
            <button
              key={role}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentRole(role)}
              className={`rounded-md px-1 py-2 text-[11px] font-semibold leading-tight transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-100/70 hover:bg-emerald-800'
              }`}
            >
              {ROLE_CONFIGS[role].shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
