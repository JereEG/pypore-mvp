import {
  AccountId,
  Client,
  PrivateKey,
  TopicId,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk';

const HASHSCAN_TRANSACTION_BASE_URL = 'https://hashscan.io/testnet/transaction/';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;

export class HederaConfigurationError extends Error {}

export interface HederaSubmissionResult {
  transactionId: string;
  hashscanUrl: string;
  timestamp: string;
}

export function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new HederaConfigurationError(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createHederaClient(): Client {
  const accountId = AccountId.fromString(readRequiredEnv('HEDERA_ACCOUNT_ID'));
  const privateKey = PrivateKey.fromString(readRequiredEnv('HEDERA_PRIVATE_KEY'));
  return Client.forTestnet()
    .setOperator(accountId, privateKey)
    .setRequestTimeout(REQUEST_TIMEOUT_MS)
    .setMaxAttempts(MAX_ATTEMPTS);
}

export function readTopicId(): TopicId {
  return TopicId.fromString(readRequiredEnv('HEDERA_TOPIC_ID'));
}

export function toHashscanTransactionId(rawTransactionId: string): string {
  const match = /^(.+)@(\d+)\.(\d+)$/.exec(rawTransactionId);
  if (!match) {
    return rawTransactionId;
  }
  const [, account, seconds, nanos] = match;
  return `${account}-${seconds}-${nanos}`;
}

export async function submitMessageToTopic(
  client: Client,
  topicId: TopicId,
  message: string
): Promise<HederaSubmissionResult> {
  const response = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);

  const record = await response.getRecord(client);
  const transactionId = toHashscanTransactionId(response.transactionId.toString());

  return {
    transactionId,
    hashscanUrl: `${HASHSCAN_TRANSACTION_BASE_URL}${transactionId}`,
    timestamp: record.consensusTimestamp.toDate().toISOString(),
  };
}
