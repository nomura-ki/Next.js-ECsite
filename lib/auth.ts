import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "acess-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
  
  type AccessPayload =  {
  userId: string;
  role: "buyer" | "seller";
}

type RefreshPayload = {
  userId: string
}

export const generateAccessToken = (payload: AccessPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: RefreshPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
}

export const verifyAccessToken = (token: string): AccessPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessPayload;
  } catch (error) {
    console.error("JWT verify accessToken error:", error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshPayload | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshPayload
  } catch (error) {
    console.error("JWT verify refreshToken error:", error)
    return null;
  }
}

/**
 * Next.jsのRequestまたはNextRequestからJWTを取得
 */
export const getTokenFromReq = (req: NextRequest | Request): string | null => {
  if ("headers" in req) {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/token=([^;]+)/);
    return match ? match[1] : null;
  }
  return null;
};

/**
 * RequestからJWTを検証してユーザー情報を取得
 */
export async function getUserFromReq(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  return verifyAccessToken(token);
}