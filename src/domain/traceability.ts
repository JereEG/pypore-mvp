export type ViewerRole = 'PRODUCER' | 'AUDITOR_SENASA' | 'FRIGORIFICO';

export type SovereigntyPolicyKey =
  | 'shareSanitaryHistory'
  | 'shareWeightMetrics'
  | 'shareExactLocation'
  | 'shareGeneticData';

export type SovereigntyPolicy = Record<SovereigntyPolicyKey, boolean>;

export type EventType = 'NACIMIENTO' | 'VACUNACION' | 'PESAJE' | 'TRASLADO';

export interface TraceabilityEvent {
  id: string;
  timestamp: string;
  type: EventType;
  title: string;
  metadata: Record<string, string>;
  visibilityCategory: SovereigntyPolicyKey;
  previousHash: string;
  signatureHash: string;
}

export interface AnimalRecord {
  caravanaId: string;
  renspa: string;
  breed: string;
  birthDate: string;
  originLocation: string;
  ownerName: string;
  sovereigntyPolicy: SovereigntyPolicy;
  events: TraceabilityEvent[];
}

export interface SignEventPayload {
  type: EventType;
  title: string;
  metadata: Record<string, string>;
  visibilityCategory: SovereigntyPolicyKey;
}

export interface SignApiResponse {
  signatureHash: string;
  timestamp: string;
  verified: boolean;
}
