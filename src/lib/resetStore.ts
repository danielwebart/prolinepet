type ResetEntry = { code: string; expiresAt: number };

const globalAny = global as any;
if (!globalAny.__resetStore) {
  globalAny.__resetStore = new Map<string, ResetEntry>();
}

const store: Map<string, ResetEntry> = globalAny.__resetStore;

export function setResetCode(email: string, code: string, ttlMs: number) {
  store.set(email.toLowerCase(), { code, expiresAt: Date.now() + ttlMs });
}

export function verifyResetCode(email: string, code: string) {
  const entry = store.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  return entry.code === code;
}

export function clearResetCode(email: string) {
  store.delete(email.toLowerCase());
}

export function getResetEntry(email: string): ResetEntry | undefined {
  return store.get(email.toLowerCase());
}