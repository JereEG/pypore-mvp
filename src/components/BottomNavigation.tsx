'use client';

import { FilePlus2, LucideIcon, ScrollText, ShieldHalf } from 'lucide-react';
import { AppView, VIEW_LABELS } from '@/domain/demoConfig';

const NAV_ITEMS: { view: AppView; icon: LucideIcon }[] = [
  { view: 'PASSPORT', icon: ScrollText },
  { view: 'SOVEREIGNTY', icon: ShieldHalf },
  { view: 'REGISTER', icon: FilePlus2 },
];

interface BottomNavigationProps {
  activeView: AppView;
  onChange: (view: AppView) => void;
}

export function BottomNavigation({ activeView, onChange }: BottomNavigationProps) {
  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-3 border-t border-stone-200 bg-white/95 backdrop-blur">
      {NAV_ITEMS.map(({ view, icon: Icon }) => {
        const isActive = view === activeView;
        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition ${
              isActive ? 'text-emerald-950' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <span
              className={`rounded-full px-4 py-1 transition ${isActive ? 'bg-emerald-600/15 text-emerald-700' : ''}`}
            >
              <Icon size={20} />
            </span>
            {VIEW_LABELS[view].navLabel}
          </button>
        );
      })}
    </nav>
  );
}
