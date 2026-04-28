// import { headers } from "next/headers";

// export const serverFetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
//   let res = await fetch(input, {
//     ...init,
//     headers: {
//       ...init?.headers,
//       cookie: (await headers()).get("cookie") ?? "",
//     }
//   });

//   if (res.status === 401) {
//     await fetch("http://localhost:3000/api/auth/refresh", {
//       method: "POST",
//       headers: {
        
//       }
//     });

//     res = await fetch(input, {
//       ...init,
//       credentials: "include"
//     });
//   }
  
//   return res;
// }

import { cookies } from "next/headers";
import { refreshCore } from "@/lib/refreshCore";

export const serverFetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString();

  let res = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      cookie: cookieHeader,
    },
  });

  if (res.status !== 401) return res;

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return res;

  const tokens = await refreshCore(refreshToken);

  cookieStore.set("accessToken", tokens.accessToken, { httpOnly: true });
  cookieStore.set("refreshToken", tokens.refreshToken, { httpOnly: true });

  // retry（更新後cookieを再利用）
  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      cookie: cookieStore.toString(),
    },
  });
};