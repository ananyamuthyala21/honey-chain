const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function backendGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function backendPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
