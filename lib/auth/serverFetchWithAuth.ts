import { headers } from "next/headers";

export const serverFetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
  let res = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      cookie: (await headers()).get("cookie") ?? "",
    }
  });

  const cookieHeader = (await headers()).get("cookie") || "";

  if (res.status === 401) {
    await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      }
    });

    res = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        cookie: (await headers()).get("cookie") ?? "",
      }
    });
  }
  
  return res;
}