'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  AnimalRecord,
  SignApiResponse,
  SovereigntyPolicy,
  SovereigntyPolicyKey,
  TraceabilityEvent,
  ViewerRole,
} from '@/domain/traceability';
import {
  DEMO_ANIMAL_RECORDS,
  GENESIS_PREVIOUS_HASH,
  UI_TEXTS,
} from '@/domain/demoConfig';

export class EventRegistrationError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = 'EventRegistrationError';
    this.status = status;
  }
}

export type NewTraceabilityEventInput = Omit<
  TraceabilityEvent,
  'id' | 'timestamp' | 'previousHash' | 'hederaTransactionId' | 'hashscanUrl' | 'isOfflinePending'
>;

interface TraceabilityContextValue {
  animalRecord: AnimalRecord;
  availableAnimals: AnimalRecord[];
  selectAnimal: (caravanaId: string) => void;
  currentRole: ViewerRole;
  setCurrentRole: (role: ViewerRole) => void;
  updateSovereigntyPolicy: (key: SovereigntyPolicyKey, value: boolean) => void;
  toggleSovereigntyPolicy: (key: SovereigntyPolicyKey) => void;
  setSovereigntyPolicy: (policy: SovereigntyPolicy) => void;
  registerSignedEvent: (input: NewTraceabilityEventInput) => Promise<TraceabilityEvent>;
  registerOfflineFallbackEvent: (input: NewTraceabilityEventInput) => Promise<TraceabilityEvent>;
  isEventVisible: (event: TraceabilityEvent) => boolean;
  visibleEvents: TraceabilityEvent[];
}

const TraceabilityContext = createContext<TraceabilityContextValue | null>(null);

async function computeLocalSha256(payload: string): Promise<string> {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
    const bytes = new TextEncoder().encode(payload);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').repeat(8);
}

function buildInitialRecords(initialRecord?: AnimalRecord): Record<string, AnimalRecord> {
  const records: Record<string, AnimalRecord> = {};
  for (const record of DEMO_ANIMAL_RECORDS) {
    records[record.caravanaId] = record;
  }
  if (initialRecord) {
    records[initialRecord.caravanaId] = initialRecord;
  }
  return records;
}

export function TraceabilityProvider({
  children,
  initialRecord,
}: {
  children: React.ReactNode;
  initialRecord?: AnimalRecord;
}) {
  const [recordsByCaravana, setRecordsByCaravana] = useState<Record<string, AnimalRecord>>(() =>
    buildInitialRecords(initialRecord)
  );
  const [selectedCaravanaId, setSelectedCaravanaId] = useState<string>(
    () => initialRecord?.caravanaId ?? DEMO_ANIMAL_RECORDS[0].caravanaId
  );
  const [currentRole, setCurrentRole] = useState<ViewerRole>('PRODUCER');

  const availableAnimals = useMemo(
    () => Object.values(recordsByCaravana),
    [recordsByCaravana]
  );

  const animalRecord = useMemo(
    () => recordsByCaravana[selectedCaravanaId] ?? availableAnimals[0],
    [recordsByCaravana, selectedCaravanaId, availableAnimals]
  );

  const selectAnimal = useCallback(
    (caravanaId: string) => {
      setSelectedCaravanaId((prev) => (recordsByCaravana[caravanaId] ? caravanaId : prev));
    },
    [recordsByCaravana]
  );

  const updateSovereigntyPolicy = useCallback(
    (key: SovereigntyPolicyKey, value: boolean) => {
      setRecordsByCaravana((prev) => {
        const current = prev[selectedCaravanaId];
        if (!current) {
          return prev;
        }
        return {
          ...prev,
          [selectedCaravanaId]: {
            ...current,
            sovereigntyPolicy: {
              ...current.sovereigntyPolicy,
              [key]: value,
            },
          },
        };
      });
    },
    [selectedCaravanaId]
  );

  const toggleSovereigntyPolicy = useCallback(
    (key: SovereigntyPolicyKey) => {
      setRecordsByCaravana((prev) => {
        const current = prev[selectedCaravanaId];
        if (!current) {
          return prev;
        }
        return {
          ...prev,
          [selectedCaravanaId]: {
            ...current,
            sovereigntyPolicy: {
              ...current.sovereigntyPolicy,
              [key]: !current.sovereigntyPolicy[key],
            },
          },
        };
      });
    },
    [selectedCaravanaId]
  );

  const setSovereigntyPolicy = useCallback(
    (policy: SovereigntyPolicy) => {
      setRecordsByCaravana((prev) => {
        const current = prev[selectedCaravanaId];
        if (!current) {
          return prev;
        }
        return {
          ...prev,
          [selectedCaravanaId]: {
            ...current,
            sovereigntyPolicy: policy,
          },
        };
      });
    },
    [selectedCaravanaId]
  );

  const isEventVisible = useCallback(
    (event: TraceabilityEvent): boolean => {
      if (currentRole === 'PRODUCER') {
        return true;
      }
      return Boolean(animalRecord.sovereigntyPolicy[event.visibilityCategory]);
    },
    [currentRole, animalRecord.sovereigntyPolicy]
  );

  const visibleEvents = useMemo(
    () => animalRecord.events.filter(isEventVisible),
    [animalRecord.events, isEventVisible]
  );

  const appendEventToActiveAnimal = useCallback(
    (caravanaId: string, newEvent: TraceabilityEvent) => {
      setRecordsByCaravana((prev) => {
        const target = prev[caravanaId];
        if (!target) {
          return prev;
        }
        return {
          ...prev,
          [caravanaId]: {
            ...target,
            events: [...target.events, newEvent],
          },
        };
      });
    },
    []
  );

  const registerSignedEvent = useCallback(
    async (input: NewTraceabilityEventInput): Promise<TraceabilityEvent> => {
      const targetCaravana = animalRecord.caravanaId;
      const lastEvent = animalRecord.events[animalRecord.events.length - 1];
      const previousHash = lastEvent ? lastEvent.hederaTransactionId : GENESIS_PREVIOUS_HASH;

      let response: Response;
      try {
        response = await fetch('/api/sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: {
              ...input,
              caravanaId: targetCaravana,
            },
            previousHash,
          }),
        });
      } catch {
        throw new EventRegistrationError(UI_TEXTS.hederaUnavailable, null);
      }

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new EventRegistrationError(
          errorBody?.error ?? UI_TEXTS.hederaUnavailable,
          response.status
        );
      }

      const { transactionId, hashscanUrl, timestamp, verified } = ((await response
        .json()
        .catch(() => null)) ?? {}) as Partial<SignApiResponse>;

      if (!verified || !transactionId || !hashscanUrl || !timestamp) {
        throw new EventRegistrationError(UI_TEXTS.hederaUnavailable, response.status);
      }

      const newEvent: TraceabilityEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...input,
        timestamp,
        previousHash,
        hederaTransactionId: transactionId,
        hashscanUrl,
      };

      appendEventToActiveAnimal(targetCaravana, newEvent);

      return newEvent;
    },
    [animalRecord.caravanaId, animalRecord.events, appendEventToActiveAnimal]
  );

  const registerOfflineFallbackEvent = useCallback(
    async (input: NewTraceabilityEventInput): Promise<TraceabilityEvent> => {
      const targetCaravana = animalRecord.caravanaId;
      const lastEvent = animalRecord.events[animalRecord.events.length - 1];
      const previousHash = lastEvent ? lastEvent.hederaTransactionId : GENESIS_PREVIOUS_HASH;
      const timestamp = new Date().toISOString();
      const digest = await computeLocalSha256(
        JSON.stringify({ caravanaId: targetCaravana, input, previousHash, timestamp })
      );

      const newEvent: TraceabilityEvent = {
        id: `evt-off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...input,
        timestamp,
        previousHash,
        hederaTransactionId: `offline-sha256-${digest.slice(0, 16)}`,
        hashscanUrl: '',
        isOfflinePending: true,
      };

      appendEventToActiveAnimal(targetCaravana, newEvent);

      return newEvent;
    },
    [animalRecord.caravanaId, animalRecord.events, appendEventToActiveAnimal]
  );

  const value = useMemo(
    () => ({
      animalRecord,
      availableAnimals,
      selectAnimal,
      currentRole,
      setCurrentRole,
      updateSovereigntyPolicy,
      toggleSovereigntyPolicy,
      setSovereigntyPolicy,
      registerSignedEvent,
      registerOfflineFallbackEvent,
      isEventVisible,
      visibleEvents,
    }),
    [
      animalRecord,
      availableAnimals,
      selectAnimal,
      currentRole,
      updateSovereigntyPolicy,
      toggleSovereigntyPolicy,
      setSovereigntyPolicy,
      registerSignedEvent,
      registerOfflineFallbackEvent,
      isEventVisible,
      visibleEvents,
    ]
  );

  return (
    <TraceabilityContext.Provider value={value}>
      {children}
    </TraceabilityContext.Provider>
  );
}

export function useTraceability(): TraceabilityContextValue {
  const context = useContext(TraceabilityContext);
  if (!context) {
    throw new Error('useTraceability must be used within a TraceabilityProvider');
  }
  return context;
}
