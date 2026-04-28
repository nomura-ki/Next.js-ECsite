import { cookies } from "next/headers";
import { refreshCore } from "./refreshCore";

export async function refreshForServer() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const tokens = await refreshCore(refreshToken);

    cookieStore.set("accessToken", tokens.accessToken, {
      httpOnly: true,
    });

    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
    });

    return tokens.accessToken;
  } catch {
    return null;
  }
}