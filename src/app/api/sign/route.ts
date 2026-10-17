import { NextResponse } from 'next/server';
import { UI_TEXTS } from '@/domain/demoConfig';
import { SignApiResponse } from '@/domain/traceability';
import {
  createHederaClient,
  readTopicId,
  submitMessageToTopic,
} from '@/lib/hedera';
import type { Client } from '@hashgraph/sdk';

interface SignRequestBody {
  payload: unknown;
  previousHash: string;
}

type ErrorResponse = { error: string };

function isValidBody(body: Partial<SignRequestBody>): body is SignRequestBody {
  return (
    typeof body.payload === 'object' &&
    body.payload !== null &&
    typeof body.previousHash === 'string' &&
    body.previousHash.trim() !== ''
  );
}

export async function POST(
  request: Request
): Promise<NextResponse<SignApiResponse | ErrorResponse>> {
  let body: Partial<SignRequestBody>;

  try {
    body = (await request.json()) as Partial<SignRequestBody>;
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: 'Invalid request: payload and previousHash are required.' },
      { status: 400 }
    );
  }

  let client: Client | undefined;

  try {
    const topicId = readTopicId();
    client = createHederaClient();

    const message = JSON.stringify({
      payload: body.payload,
      previousHash: body.previousHash,
      submittedAt: new Date().toISOString(),
    });

    const result = await submitMessageToTopic(client, topicId, message);

    return NextResponse.json({ ...result, verified: true });
  } catch (error) {
    console.error('[api/sign] Hedera submission failed', error);
    return NextResponse.json({ error: UI_TEXTS.hederaUnavailable }, { status: 503 });
  } finally {
    client?.close();
  }
}
