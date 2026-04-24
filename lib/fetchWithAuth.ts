import { redirect } from "next/navigation"

export const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  const refreshRes = await fetch("http://localhost:3000/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes) {
    throw new Error("Unauthorized");
  }

  res = await fetch(input, {
    ...init,
    credentials: "include",
  })

  return res;
}