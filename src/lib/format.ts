export function truncateHash(hash: string): string {
  if (hash.length <= 20) {
    return hash;
  }
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

export function formatTechnicalDate(isoDate: string): string {
  return isoDate.replace('T', ' ').replace(/\.\d+Z$/, 'Z');
}
