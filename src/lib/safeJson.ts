export async function safeParseJson<T>(response: Response, fallback: T): Promise<T> {
  try {
    const text = await response.text().catch(() => "");
    if (!text) return fallback;
    try {
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  } catch {
    return fallback;
  }
}