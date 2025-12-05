import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface JWTPayload {
  userId: string;
  role: "buyer" | "seller";
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error("JWT verify error:", error);
    return null;
  }
};

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
export const getUserFromReq = (
  req: NextRequest | Request
): JWTPayload | null => {
  const token = getTokenFromReq(req);
  if (!token) return null;
  return verifyToken(token);
};
