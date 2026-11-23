import { EVENT_POLICY_CATEGORY } from '@/domain/demoConfig';
import { EventType, SovereigntyPolicyKey } from '@/domain/traceability';

export interface ParsedFieldEvent {
  type: EventType;
  title: string;
  quantityOrId: string;
  date: string;
  observations: string;
  metadata: Record<string, string>;
  visibilityCategory: SovereigntyPolicyKey;
}

const VALID_EVENT_TYPES: readonly EventType[] = [
  'NACIMIENTO',
  'VACUNACION',
  'PESAJE',
  'TRASLADO',
];

function sanitizeText(input: string): string {
  return input.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);
}

function detectEventType(normalized: string): EventType {
  if (/(vacun|aftosa|brucelosis|dosis|antiparasit|garrapata|ivermectina|sanidad|remedio)/.test(normalized)) {
    return 'VACUNACION';
  }
  if (/(pes|kilo|\bkg\b|balanza|b[aá]scula|destete|kilaje)/.test(normalized)) {
    return 'PESAJE';
  }
  if (/(traslad|gu[ií]a|\bdta\b|cami[oó]n|remate|feria|frigor[ií]fico|movimiento|envi[eé]|despach)/.test(normalized)) {
    return 'TRASLADO';
  }
  if (/(nac|pari[oó]|parici[oó]n|bucerro|terner|caravan)/.test(normalized)) {
    return 'NACIMIENTO';
  }
  return 'VACUNACION';
}

function extractDate(normalized: string): string {
  const isoMatch = /\b(\d{4}-\d{2}-\d{2})\b/.exec(normalized);
  if (isoMatch) {
    return isoMatch[1];
  }
  const dmyMatch = /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/.exec(normalized);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3].length === 2 ? `20${dmyMatch[3]}` : dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  const today = new Date();
  if (/\bayer\b/.test(normalized)) {
    today.setDate(today.getDate() - 1);
  }
  return today.toISOString().slice(0, 10);
}

function extractQuantityOrId(clean: string): string {
  const caravanaMatch = /\b([A-Z]{2}-\d{2}(?:-[A-Z0-9]+)+)\b/i.exec(clean);
  if (caravanaMatch) {
    return caravanaMatch[1].toUpperCase();
  }
  const qtyMatch = /\b(\d+(?:[.,]\d+)?\s*(?:terneros?|terneras?|bucerro?s?|b[uú]falos?|b[uú]falas?|vacas?|novillos?|vaquillonas?|cabezas?|kg|kilos?))\b/i.exec(clean);
  if (qtyMatch) {
    return qtyMatch[1];
  }
  const loteMatch = /\b(lote\s+[A-Z0-9-]+)\b/i.exec(clean);
  if (loteMatch) {
    return loteMatch[1];
  }
  return 'Ejemplar / Lote activo';
}

function extractLocation(clean: string): string {
  const locMatch = /\b((?:potrero|lote|estero|campo|corral)\s+[a-záéíóúñ0-9-]+(?:\s+[a-záéíóúñ0-9-]+)?)/i.exec(clean);
  return locMatch ? locMatch[1] : '';
}

export function parseNaturalFieldEvent(rawInput: string): ParsedFieldEvent | null {
  const clean = sanitizeText(rawInput);
  if (clean.length < 4) {
    return null;
  }

  const normalized = clean.toLowerCase();
  const type = detectEventType(normalized);
  if (!VALID_EVENT_TYPES.includes(type)) {
    return null;
  }

  const quantityOrId = extractQuantityOrId(clean);
  const date = extractDate(normalized);
  const location = extractLocation(clean);

  const titlePrefix: Record<EventType, string> = {
    NACIMIENTO: 'Nacimiento y Caravaneo',
    VACUNACION: 'Registro Sanitario',
    PESAJE: 'Control de Peso',
    TRASLADO: 'Movimiento / Traslado',
  };

  const title = `${titlePrefix[type]} · ${quantityOrId}`.slice(0, 120);

  const metadata: Record<string, string> = {
    'Cantidad / ID': quantityOrId,
    'Fecha': date,
    ...(location ? { 'Ubicación': location } : {}),
    'Observaciones': clean,
  };

  return {
    type,
    title,
    quantityOrId,
    date,
    observations: clean,
    metadata,
    visibilityCategory: EVENT_POLICY_CATEGORY[type],
  };
}
