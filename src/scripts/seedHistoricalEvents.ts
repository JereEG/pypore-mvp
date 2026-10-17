import { GENESIS_PREVIOUS_HASH, SEED_ANIMAL_RECORD } from '../domain/demoConfig';
import { TraceabilityEvent } from '../domain/traceability';
import {
  createHederaClient,
  readTopicId,
  submitMessageToTopic,
} from '../lib/hedera';

async function seedHistoricalEvents(): Promise<void> {
  const topicId = readTopicId();
  const client = createHederaClient();
  const syncedEvents: TraceabilityEvent[] = [];

  try {
    let previousHash = GENESIS_PREVIOUS_HASH;

    for (const event of SEED_ANIMAL_RECORD.events) {
      const message = JSON.stringify({
        payload: {
          type: event.type,
          title: event.title,
          metadata: event.metadata,
          visibilityCategory: event.visibilityCategory,
          occurredAt: event.timestamp,
        },
        previousHash,
        submittedAt: new Date().toISOString(),
      });

      const result = await submitMessageToTopic(client, topicId, message);

      syncedEvents.push({
        ...event,
        previousHash,
        hederaTransactionId: result.transactionId,
        hashscanUrl: result.hashscanUrl,
      });

      console.error(`[${syncedEvents.length}/${SEED_ANIMAL_RECORD.events.length}] ${event.id} -> ${result.transactionId}`);
      previousHash = result.transactionId;
    }
  } catch (error) {
    console.error('Seeding aborted.', error instanceof Error ? error.message : error);
    if (syncedEvents.length > 0) {
      console.error(
        `Already published (${syncedEvents.length}). Re-running will duplicate them on the topic:`
      );
      console.error(JSON.stringify(syncedEvents, null, 2));
    }
    process.exitCode = 1;
    return;
  } finally {
    client.close();
  }

  console.log('Replace the "events" array of SEED_ANIMAL_RECORD in src/domain/demoConfig.ts with:\n');
  console.log(`  events: ${JSON.stringify(syncedEvents, null, 2).replace(/\n/g, '\n  ')},`);
}

seedHistoricalEvents().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
