import { NextResponse } from 'next/server';
import { UI_TEXTS } from '@/domain/demoConfig';
import { EventType, SignApiResponse, SovereigntyPolicyKey } from '@/domain/traceability';
import {
  createHederaClient,
  readTopicId,
  submitMessageToTopic,
} from '@/lib/hedera';
import type { Client } from '@hashgraph/sdk';

const MAX_BODY_BYTES = 8_192;
const MAX_MESSAGE_BYTES = 4_096;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 15;

const ALLOWED_EVENT_TYPES = new Set<EventType>(['NACIMIENTO', 'VACUNACION', 'PESAJE', 'TRASLADO']);
const ALLOWED_VISIBILITY_KEYS = new Set<SovereigntyPolicyKey>([
  'shareSanitaryHistory',
  'shareWeightMetrics',
  'shareExactLocation',
  'shareGeneticData',
]);
const ALLOWED_BODY_KEYS = new Set(['payload', 'previousHash']);
const ALLOWED_PAYLOAD_KEYS = new Set([
  'type',
  'title',
  'metadata',
  'visibilityCategory',
  'caravanaId',
  'capturedOfflineAt',
]);

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface SignRequestBody {
  payload: Record<string, unknown>;
  previousHash: string;
}

type ErrorResponse = { error: string };

function sanitizeString(value: string, maxLength: number): string {
  return value.replace(/[\x00-\x1F\x7F]/g, ' ').trim().slice(0, maxLength);
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim() || 'unknown';
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now >= existing.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function validateAndSanitizeBody(raw: unknown): SignRequestBody | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED_BODY_KEYS.has(key)) {
      return null;
    }
  }

  if (typeof record.previousHash !== 'string') {
    return null;
  }
  const previousHash = sanitizeString(record.previousHash, 128);
  if (!previousHash) {
    return null;
  }

  if (typeof record.payload !== 'object' || record.payload === null || Array.isArray(record.payload)) {
    return null;
  }

  const rawPayload = record.payload as Record<string, unknown>;
  for (const key of Object.keys(rawPayload)) {
    if (!ALLOWED_PAYLOAD_KEYS.has(key)) {
      return null;
    }
  }

  if (
    typeof rawPayload.type !== 'string' ||
    !ALLOWED_EVENT_TYPES.has(rawPayload.type as EventType)
  ) {
    return null;
  }

  if (
    typeof rawPayload.visibilityCategory !== 'string' ||
    !ALLOWED_VISIBILITY_KEYS.has(rawPayload.visibilityCategory as SovereigntyPolicyKey)
  ) {
    return null;
  }

  if (typeof rawPayload.title !== 'string') {
    return null;
  }
  const title = sanitizeString(rawPayload.title, 160);
  if (!title) {
    return null;
  }

  if (
    typeof rawPayload.metadata !== 'object' ||
    rawPayload.metadata === null ||
    Array.isArray(rawPayload.metadata)
  ) {
    return null;
  }

  const rawMetadata = rawPayload.metadata as Record<string, unknown>;
  const metadataEntries = Object.entries(rawMetadata);
  if (metadataEntries.length > 12) {
    return null;
  }

  const sanitizedMetadata: Record<string, string> = {};
  for (const [key, value] of metadataEntries) {
    if (typeof value !== 'string') {
      return null;
    }
    const cleanKey = sanitizeString(key, 60);
    const cleanValue = sanitizeString(value, 240);
    if (cleanKey) {
      sanitizedMetadata[cleanKey] = cleanValue;
    }
  }

  const sanitizedPayload: Record<string, unknown> = {
    type: rawPayload.type,
    title,
    metadata: sanitizedMetadata,
    visibilityCategory: rawPayload.visibilityCategory,
  };

  if (typeof rawPayload.caravanaId === 'string') {
    const cleanCaravana = sanitizeString(rawPayload.caravanaId, 40);
    if (cleanCaravana) {
      sanitizedPayload.caravanaId = cleanCaravana;
    }
  }

  if (typeof rawPayload.capturedOfflineAt === 'string') {
    const cleanDate = sanitizeString(rawPayload.capturedOfflineAt, 40);
    if (cleanDate) {
      sanitizedPayload.capturedOfflineAt = cleanDate;
    }
  }

  return {
    payload: sanitizedPayload,
    previousHash,
  };
}

export async function POST(
  request: Request
): Promise<NextResponse<SignApiResponse | ErrorResponse>> {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting again.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json({ error: 'Unable to read request body.' }, { status: 400 });
  }

  if (Buffer.byteLength(rawText, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText) as unknown;
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const validated = validateAndSanitizeBody(parsedJson);
  if (!validated) {
    return NextResponse.json(
      { error: 'Invalid request payload or unexpected fields.' },
      { status: 400 }
    );
  }

  const message = JSON.stringify({
    payload: validated.payload,
    previousHash: validated.previousHash,
    submittedAt: new Date().toISOString(),
  });

  if (Buffer.byteLength(message, 'utf8') > MAX_MESSAGE_BYTES) {
    return NextResponse.json({ error: 'Serialized event exceeds maximum size.' }, { status: 413 });
  }

  let client: Client | undefined;

  try {
    const topicId = readTopicId();
    client = createHederaClient();

    const result = await submitMessageToTopic(client, topicId, message);

    return NextResponse.json({ ...result, verified: true });
  } catch (error) {
    console.error('[api/sign] Hedera submission failed', error);
    return NextResponse.json({ error: UI_TEXTS.hederaUnavailable }, { status: 503 });
  } finally {
    client?.close();
  }
}
