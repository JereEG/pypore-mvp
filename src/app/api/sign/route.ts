import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { SignApiResponse } from '@/domain/traceability';

interface SignRequestBody {
  payload: unknown;
  previousHash: string;
}

export async function POST(request: Request): Promise<NextResponse<SignApiResponse | { error: string }>> {
  try {
    const body = (await request.json()) as Partial<SignRequestBody>;
    const { payload, previousHash } = body;

    if (!payload || typeof previousHash !== 'string' || previousHash.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid request: payload and previousHash are required.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const serializedData = `${previousHash}|${timestamp}|${JSON.stringify(payload)}`;
    const signatureHash = crypto.createHash('sha256').update(serializedData).digest('hex');

    return NextResponse.json({
      signatureHash,
      timestamp,
      verified: true,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while signing event.' },
      { status: 500 }
    );
  }
}
