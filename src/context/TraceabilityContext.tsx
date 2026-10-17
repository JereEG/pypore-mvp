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
import { GENESIS_PREVIOUS_HASH, SEED_ANIMAL_RECORD, UI_TEXTS } from '@/domain/demoConfig';

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
  'id' | 'timestamp' | 'previousHash' | 'hederaTransactionId' | 'hashscanUrl'
>;

interface TraceabilityContextValue {
  animalRecord: AnimalRecord;
  currentRole: ViewerRole;
  setCurrentRole: (role: ViewerRole) => void;
  updateSovereigntyPolicy: (key: SovereigntyPolicyKey, value: boolean) => void;
  toggleSovereigntyPolicy: (key: SovereigntyPolicyKey) => void;
  setSovereigntyPolicy: (policy: SovereigntyPolicy) => void;
  registerSignedEvent: (input: NewTraceabilityEventInput) => Promise<TraceabilityEvent>;
  isEventVisible: (event: TraceabilityEvent) => boolean;
  visibleEvents: TraceabilityEvent[];
}

const TraceabilityContext = createContext<TraceabilityContextValue | null>(null);

export function TraceabilityProvider({
  children,
  initialRecord = SEED_ANIMAL_RECORD,
}: {
  children: React.ReactNode;
  initialRecord?: AnimalRecord;
}) {
  const [animalRecord, setAnimalRecord] = useState<AnimalRecord>(initialRecord);
  const [currentRole, setCurrentRole] = useState<ViewerRole>('PRODUCER');

  const updateSovereigntyPolicy = useCallback(
    (key: SovereigntyPolicyKey, value: boolean) => {
      setAnimalRecord((prev) => ({
        ...prev,
        sovereigntyPolicy: {
          ...prev.sovereigntyPolicy,
          [key]: value,
        },
      }));
    },
    []
  );

  const toggleSovereigntyPolicy = useCallback(
    (key: SovereigntyPolicyKey) => {
      setAnimalRecord((prev) => ({
        ...prev,
        sovereigntyPolicy: {
          ...prev.sovereigntyPolicy,
          [key]: !prev.sovereigntyPolicy[key],
        },
      }));
    },
    []
  );

  const setSovereigntyPolicy = useCallback(
    (policy: SovereigntyPolicy) => {
      setAnimalRecord((prev) => ({
        ...prev,
        sovereigntyPolicy: policy,
      }));
    },
    []
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

  const registerSignedEvent = useCallback(
    async (input: NewTraceabilityEventInput): Promise<TraceabilityEvent> => {
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
            payload: input,
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

      setAnimalRecord((prev) => ({
        ...prev,
        events: [...prev.events, newEvent],
      }));

      return newEvent;
    },
    [animalRecord.events]
  );

  const value = useMemo(
    () => ({
      animalRecord,
      currentRole,
      setCurrentRole,
      updateSovereigntyPolicy,
      toggleSovereigntyPolicy,
      setSovereigntyPolicy,
      registerSignedEvent,
      isEventVisible,
      visibleEvents,
    }),
    [
      animalRecord,
      currentRole,
      updateSovereigntyPolicy,
      toggleSovereigntyPolicy,
      setSovereigntyPolicy,
      registerSignedEvent,
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
