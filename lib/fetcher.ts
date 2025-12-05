export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "通信に失敗しました");
  }
  return data.data as T;
}
