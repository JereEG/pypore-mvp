export type AppView = 'PASSPORT' | 'SOVEREIGNTY' | 'REGISTER';

import {
  AnimalRecord,
  EventType,
  SovereigntyPolicyKey,
  ViewerRole,
} from './traceability';

export interface RoleDescriptor {
  key: ViewerRole;
  label: string;
  shortLabel: string;
  description: string;
  badge: string;
}

export interface PolicyDescriptor {
  key: SovereigntyPolicyKey;
  label: string;
  description: string;
  impact: string;
}

export const ROLE_CONFIGS: Record<ViewerRole, RoleDescriptor> = {
  PRODUCER: {
    key: 'PRODUCER',
    label: 'Productor Ganadero',
    shortLabel: 'Productor (Dueño)',
    description: 'Acceso irrestricto y control soberano de políticas de divulgación.',
    badge: 'Titular / Origen',
  },
  AUDITOR_SENASA: {
    key: 'AUDITOR_SENASA',
    label: 'Auditor SENASA',
    shortLabel: 'Auditor (SENASA)',
    description: 'Fiscalización de sanidad animal, campañas de vacunación y estatus de rodeo.',
    badge: 'Autoridad Sanitaria',
  },
  FRIGORIFICO: {
    key: 'FRIGORIFICO',
    label: 'Frigorífico / Comprador',
    shortLabel: 'Frigorífico',
    description: 'Auditoría de peso, trazabilidad de origen y aptitud para faena/exportación.',
    badge: 'Cadena de Valor',
  },
};

export const SOVEREIGNTY_POLICY_CONFIGS: Record<SovereigntyPolicyKey, PolicyDescriptor> = {
  shareSanitaryHistory: {
    key: 'shareSanitaryHistory',
    label: 'Historial Sanitario',
    description: 'Vacunas antiaftosa, brucelosis y tratamientos oficiales certificados.',
    impact: 'Si lo desactivás, SENASA y el frigorífico no pueden ver vacunaciones ni tratamientos.',
  },
  shareWeightMetrics: {
    key: 'shareWeightMetrics',
    label: 'Métricas de Peso',
    description: 'Pesajes de destete, ganancias diarias y registros de balanza digital.',
    impact: 'Protege tu rendimiento productivo y evita que el comprador negocie con tus curvas de ganancia.',
  },
  shareExactLocation: {
    key: 'shareExactLocation',
    label: 'Ubicación Exacta',
    description: 'Coordenadas GPS del potrero y establecimiento en lugar de zona departamental.',
    impact: 'Oculta los traslados y el potrero exacto; solo queda visible la zona de origen.',
  },
  shareGeneticData: {
    key: 'shareGeneticData',
    label: 'Datos Genéticos',
    description: 'Genealogía, padre/madre registrados y pedigree de raza Braford.',
    impact: 'Resguarda tu inversión genética: padres, madres y pedigree quedan fuera del alcance de terceros.',
  },
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  NACIMIENTO: 'Nacimiento',
  VACUNACION: 'Vacunación',
  PESAJE: 'Pesaje',
  TRASLADO: 'Traslado',
};

export const EVENT_POLICY_CATEGORY: Record<EventType, SovereigntyPolicyKey> = {
  NACIMIENTO: 'shareGeneticData',
  VACUNACION: 'shareSanitaryHistory',
  PESAJE: 'shareWeightMetrics',
  TRASLADO: 'shareExactLocation',
};

export const EVENT_FORM_FIELDS: Record<EventType, string[]> = {
  NACIMIENTO: ['Peso al Nacer', 'Padre', 'Madre'],
  VACUNACION: ['Vacuna', 'Dosis', 'Veterinario Matrícula'],
  PESAJE: ['Peso Bruto', 'Balanza', 'Estado Corporal'],
  TRASLADO: ['Destino', 'Transporte', 'Guía DTA'],
};

export const EVENT_TITLE_PLACEHOLDERS: Record<EventType, string> = {
  NACIMIENTO: 'Ej: Nacimiento y Caravaneo Oficial',
  VACUNACION: 'Ej: Refuerzo Brucelosis Campaña 2025',
  PESAJE: 'Ej: Pesaje de Recría',
  TRASLADO: 'Ej: Traslado a Invernada',
};

export const VIEW_LABELS: Record<AppView, { title: string; navLabel: string }> = {
  PASSPORT: { title: 'Pasaporte y Trazabilidad', navLabel: 'Pasaporte' },
  SOVEREIGNTY: { title: 'Soberanía de Datos', navLabel: 'Soberanía' },
  REGISTER: { title: 'Registrar Evento', navLabel: 'Registrar' },
};

export const UI_TEXTS = {
  appName: 'Pypore',
  sovereignIdentity: 'Identidad Soberana Activa',
  hashVerified: 'Hedera HCS Verificado',
  protectedData: 'Dato protegido por Soberanía del Productor',
  simulatorTitle: 'Simulador de Actor · Demo',
  producerOnlyTitle: 'Panel exclusivo del Productor',
  producerOnlyBody: 'Cambiá al rol Productor (Dueño) para administrar qué datos se comparten con terceros.',
  signingLabel: 'Firmando en servidor…',
  submitLabel: 'Firmar y registrar evento',
  signedSuccess: 'Evento firmado y encadenado',
  signedError: 'No se pudo firmar el evento. Reintentá.',
  hederaUnavailable:
    'La red de Hedera está experimentando demoras. El evento no se registró todavía; tus datos siguen en el formulario para reintentar.',
  dismissError: 'Cerrar aviso',
  sharingOn: 'Compartido',
  sharingOff: 'Protegido',
};

export const GENESIS_PREVIOUS_HASH =
  '0000000000000000000000000000000000000000000000000000000000000000';

export const SEED_ANIMAL_RECORD: AnimalRecord = {
  caravanaId: 'AR-05-8842-A',
  renspa: '04.022.0.01234/00',
  breed: 'Braford',
  birthDate: '2024-09-12',
  originLocation: 'Mercedes, Corrientes',
  ownerName: 'Establecimiento El Rocío - Ganadera del Litoral',
  sovereigntyPolicy: {
    shareSanitaryHistory: true,
    shareWeightMetrics: true,
    shareExactLocation: false,
    shareGeneticData: false,
  },
  events: [
    {
      id: 'evt-001-nac',
      timestamp: '2024-09-12T08:30:00.000Z',
      type: 'NACIMIENTO',
      title: 'Nacimiento y Caravaneo Oficial',
      metadata: {
        'Potrero': 'Lote 4 - Tajamar',
        'Peso al Nacer': '34 kg',
        'Padre': 'Braford Gran Campeón Mercedes 2021',
        'Madre': 'Vaquillona RP 4210',
        'Caravana Visual': 'Amarilla Corrientes 8842',
      },
      visibilityCategory: 'shareGeneticData',
      previousHash: GENESIS_PREVIOUS_HASH,
      hederaTransactionId: '0.0.11003724-1792214697-886430608',
      hashscanUrl: 'https://hashscan.io/testnet/transaction/0.0.11003724-1792214697-886430608',
    },
    {
      id: 'evt-002-aftosa',
      timestamp: '2024-11-20T10:15:00.000Z',
      type: 'VACUNACION',
      title: 'Campaña Oficial Antiaftosa (SENASA)',
      metadata: {
        'Vacuna': 'Aftosa Bivalente',
        'Dosis': '2 ml subcutánea',
        'Veterinario Matrícula': 'MP-CTES 1492',
        'Campaña': '2da Campaña 2024 Corrientes',
        'Certificado Acta': 'ACTA-SENASA-2024-8831',
      },
      visibilityCategory: 'shareSanitaryHistory',
      previousHash: '0.0.11003724-1792214697-886430608',
      hederaTransactionId: '0.0.11003724-1792214700-750845560',
      hashscanUrl: 'https://hashscan.io/testnet/transaction/0.0.11003724-1792214700-750845560',
    },
    {
      id: 'evt-003-pesaje',
      timestamp: '2025-03-10T14:45:00.000Z',
      type: 'PESAJE',
      title: 'Pesaje de Destete Precoz',
      metadata: {
        'Peso Bruto': '198 kg',
        'Ganancia Diaria': '0.920 kg/día',
        'Balanza': 'Báscula Digital Tru-Test S3',
        'Estado Corporal': '4/5',
      },
      visibilityCategory: 'shareWeightMetrics',
      previousHash: '0.0.11003724-1792214700-750845560',
      hederaTransactionId: '0.0.11003724-1792214702-696914161',
      hashscanUrl: 'https://hashscan.io/testnet/transaction/0.0.11003724-1792214702-696914161',
    },
  ],
};
