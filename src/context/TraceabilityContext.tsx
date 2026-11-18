'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AnimalRecord,
  SignApiResponse,
  SovereigntyPolicy,
  SovereigntyPolicyKey,
  TraceabilityEvent,
  TripleSignature,
  ViewerRole,
} from '@/domain/traceability';
import {
  DEMO_ANIMAL_RECORDS,
  GENESIS_PREVIOUS_HASH,
  UI_TEXTS,
} from '@/domain/demoConfig';

const OPERATIONAL_DB_KEY = 'pypore_operational_db_v1';

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

export interface SyncResult {
  synced: number;
  failed: number;
}

interface TraceabilityContextValue {
  animalRecord: AnimalRecord;
  availableAnimals: AnimalRecord[];
  selectAnimal: (caravanaId: string) => void;
  currentRole: ViewerRole;
  setCurrentRole: (role: ViewerRole) => void;
  isOfflineFieldMode: boolean;
  toggleOfflineFieldMode: () => void;
  pendingOfflineCount: number;
  isDemoModified: boolean;
  updateSovereigntyPolicy: (key: SovereigntyPolicyKey, value: boolean) => void;
  toggleSovereigntyPolicy: (key: SovereigntyPolicyKey) => void;
  setSovereigntyPolicy: (policy: SovereigntyPolicy) => void;
  registerSignedEvent: (input: NewTraceabilityEventInput) => Promise<TraceabilityEvent>;
  registerOfflineFallbackEvent: (input: NewTraceabilityEventInput) => Promise<TraceabilityEvent>;
  syncOfflineEvents: () => Promise<SyncResult>;
  resetDemoData: () => void;
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

function buildEventSignatures(
  ownerName: string,
  metadata: Record<string, string>,
  isOnline: boolean
): TripleSignature {
  const producer = ownerName.split(' - ')[0] || ownerName;
  const vetMatricula = metadata['Veterinario Matrícula'];
  return {
    producer,
    ...(vetMatricula ? { veterinarian: `Vet. ${vetMatricula}` } : {}),
    ...(isOnline ? { authority: 'Validado Hedera HCS' } : {}),
  };
}

function readStoredRecords(
  fallback: Record<string, AnimalRecord>
): Record<string, AnimalRecord> | null {
  try {
    const raw = window.localStorage.getItem(OPERATIONAL_DB_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Record<string, AnimalRecord>;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const merged: Record<string, AnimalRecord> = { ...fallback };
    for (const [caravanaId, record] of Object.entries(parsed)) {
      if (record && typeof record.caravanaId === 'string' && Array.isArray(record.events)) {
        merged[caravanaId] = record;
      }
    }
    return merged;
  } catch {
    return null;
  }
}

export function TraceabilityProvider({
  children,
  initialRecord,
}: {
  children: React.ReactNode;
  initialRecord?: AnimalRecord;
}) {
  const defaultRecords = useMemo(() => buildInitialRecords(initialRecord), [initialRecord]);
  const [recordsByCaravana, setRecordsByCaravana] =
    useState<Record<string, AnimalRecord>>(defaultRecords);
  const [selectedCaravanaId, setSelectedCaravanaId] = useState<string>(
    () => initialRecord?.caravanaId ?? DEMO_ANIMAL_RECORDS[0].caravanaId
  );
  const [currentRole, setCurrentRole] = useState<ViewerRole>('PRODUCER');
  const [isOfflineFieldMode, setIsOfflineFieldMode] = useState(false);

  const recordsRef = useRef(recordsByCaravana);
  const persistAllowedRef = useRef(false);

  useEffect(() => {
    recordsRef.current = recordsByCaravana;
  }, [recordsByCaravana]);

  useEffect(() => {
    if (initialRecord) {
      persistAllowedRef.current = true;
      return;
    }
    const stored = readStoredRecords(defaultRecords);
    persistAllowedRef.current = true;
    if (stored) {
      Promise.resolve().then(() => {
        setRecordsByCaravana(stored);
      });
    }
  }, [defaultRecords, initialRecord]);

  useEffect(() => {
    if (!persistAllowedRef.current || initialRecord) {
      return;
    }
    try {
      window.localStorage.setItem(OPERATIONAL_DB_KEY, JSON.stringify(recordsByCaravana));
    } catch {
    }
  }, [recordsByCaravana, initialRecord]);

  const availableAnimals = useMemo(
    () => Object.values(recordsByCaravana),
    [recordsByCaravana]
  );

  const animalRecord = useMemo(
    () => recordsByCaravana[selectedCaravanaId] ?? availableAnimals[0],
    [recordsByCaravana, selectedCaravanaId, availableAnimals]
  );

  const pendingOfflineCount = useMemo(
    () => animalRecord.events.filter((event) => Boolean(event.isOfflinePending)).length,
    [animalRecord.events]
  );

  const isDemoModified = useMemo(
    () => JSON.stringify(recordsByCaravana) !== JSON.stringify(defaultRecords),
    [recordsByCaravana, defaultRecords]
  );

  const selectAnimal = useCallback(
    (caravanaId: string) => {
      setSelectedCaravanaId((prev) => (recordsByCaravana[caravanaId] ? caravanaId : prev));
    },
    [recordsByCaravana]
  );

  const toggleOfflineFieldMode = useCallback(() => {
    setIsOfflineFieldMode((prev) => !prev);
  }, []);

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
        signatures:
          input.signatures ?? buildEventSignatures(animalRecord.ownerName, input.metadata, true),
      };

      appendEventToActiveAnimal(targetCaravana, newEvent);

      return newEvent;
    },
    [animalRecord.caravanaId, animalRecord.events, animalRecord.ownerName, appendEventToActiveAnimal]
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
        signatures:
          input.signatures ?? buildEventSignatures(animalRecord.ownerName, input.metadata, false),
      };

      appendEventToActiveAnimal(targetCaravana, newEvent);

      return newEvent;
    },
    [animalRecord.caravanaId, animalRecord.events, animalRecord.ownerName, appendEventToActiveAnimal]
  );

  const syncOfflineEvents = useCallback(async (): Promise<SyncResult> => {
    const targetCaravana = selectedCaravanaId;
    const currentAnimal = recordsRef.current[targetCaravana];
    if (!currentAnimal) {
      return { synced: 0, failed: 0 };
    }

    const updatedEvents = [...currentAnimal.events];
    let synced = 0;
    let failed = 0;

    for (let index = 0; index < updatedEvents.length; index += 1) {
      const event = updatedEvents[index];
      if (!event.isOfflinePending) {
        continue;
      }

      const previousHash =
        index > 0 ? updatedEvents[index - 1].hederaTransactionId : GENESIS_PREVIOUS_HASH;

      try {
        const response = await fetch('/api/sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: {
              type: event.type,
              title: event.title,
              metadata: event.metadata,
              visibilityCategory: event.visibilityCategory,
              caravanaId: targetCaravana,
              capturedOfflineAt: event.timestamp,
            },
            previousHash,
          }),
        });

        if (!response.ok) {
          failed += 1;
          break;
        }

        const { transactionId, hashscanUrl, verified } = ((await response
          .json()
          .catch(() => null)) ?? {}) as Partial<SignApiResponse>;

        if (!verified || !transactionId || !hashscanUrl) {
          failed += 1;
          break;
        }

        const syncedEvent: TraceabilityEvent = {
          ...event,
          previousHash,
          hederaTransactionId: transactionId,
          hashscanUrl,
          isOfflinePending: false,
          signatures: {
            producer:
              event.signatures?.producer ??
              (currentAnimal.ownerName.split(' - ')[0] || currentAnimal.ownerName),
            ...(event.signatures?.veterinarian
              ? { veterinarian: event.signatures.veterinarian }
              : {}),
            authority: 'Sincronizado Hedera HCS',
          },
        };

        updatedEvents[index] = syncedEvent;
        synced += 1;

        setRecordsByCaravana((prev) => {
          const target = prev[targetCaravana];
          if (!target) {
            return prev;
          }
          const nextEvents = target.events.map((item) =>
            item.id === syncedEvent.id ? syncedEvent : item
          );
          return {
            ...prev,
            [targetCaravana]: {
              ...target,
              events: nextEvents,
            },
          };
        });
      } catch {
        failed += 1;
        break;
      }
    }

    return { synced, failed };
  }, [selectedCaravanaId]);

  const resetDemoData = useCallback(() => {
    try {
      window.localStorage.removeItem(OPERATIONAL_DB_KEY);
    } catch {
    }
    setRecordsByCaravana(defaultRecords);
    setIsOfflineFieldMode(false);
  }, [defaultRecords]);

  const value = useMemo(
    () => ({
      animalRecord,
      availableAnimals,
      selectAnimal,
      currentRole,
      setCurrentRole,
      isOfflineFieldMode,
      toggleOfflineFieldMode,
      pendingOfflineCount,
      isDemoModified,
      updateSovereigntyPolicy,
      toggleSovereigntyPolicy,
      setSovereigntyPolicy,
      registerSignedEvent,
      registerOfflineFallbackEvent,
      syncOfflineEvents,
      resetDemoData,
      isEventVisible,
      visibleEvents,
    }),
    [
      animalRecord,
      availableAnimals,
      selectAnimal,
      currentRole,
      isOfflineFieldMode,
      toggleOfflineFieldMode,
      pendingOfflineCount,
      isDemoModified,
      updateSovereigntyPolicy,
      toggleSovereigntyPolicy,
      setSovereigntyPolicy,
      registerSignedEvent,
      registerOfflineFallbackEvent,
      syncOfflineEvents,
      resetDemoData,
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
