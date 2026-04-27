import { headers } from "next/headers";

export const serverFetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
  let res = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      cookie: (await headers()).get("cookie") ?? "",
    }
  });

  if (res.status === 401) {
    await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: {
        
      }
    });

    res = await fetch(input, {
      ...init,
      credentials: "include"
    });
  }
  
  return res;
}