import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Pasaporte Digital Ganadero · Demo Interactiva | Pyporé',
  description:
    'Simulador interactivo del Pasaporte Digital Ganadero con soberanía de datos y consenso inmutable en Hedera Consensus Service (HCS).',
};

export default function DemoPage() {
  return <AppShell />;
}

