import { ExternalLink } from 'lucide-react';
import { truncateHash } from '@/lib/format';

interface HederaTransactionLinkProps {
  transactionId: string;
  hashscanUrl: string;
  className?: string;
}

export function HederaTransactionLink({
  transactionId,
  hashscanUrl,
  className = '',
}: HederaTransactionLinkProps) {
  return (
    <a
      href={hashscanUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={transactionId}
      className={`inline-flex items-center gap-1.5 font-mono text-emerald-700 underline decoration-emerald-600/40 underline-offset-2 transition hover:text-emerald-900 ${className}`}
    >
      <ExternalLink size={11} className="shrink-0" />
      {truncateHash(transactionId)}
    </a>
  );
}
