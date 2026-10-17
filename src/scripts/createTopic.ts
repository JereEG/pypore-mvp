import { createHederaClient } from '../lib/hedera';
import { TopicCreateTransaction } from '@hashgraph/sdk';

async function createTopic(): Promise<void> {
  const client = createHederaClient();

  try {
    const response = await new TopicCreateTransaction()
      .setTopicMemo('pypore-mvp livestock traceability')
      .execute(client);
    const receipt = await response.getReceipt(client);

    if (!receipt.topicId) {
      throw new Error('Topic creation receipt did not include a topicId');
    }

    console.log(`HEDERA_TOPIC_ID=${receipt.topicId.toString()}`);
  } finally {
    client.close();
  }
}

createTopic().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
