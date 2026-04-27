export const clientFetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    res = await fetch(input, {
      ...init,
      credentials: "include"
    });
  }
  
  return res;
}