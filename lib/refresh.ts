import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, generateAccessToken } from "./auth";

export const refreshAccessToken = async (refreshToken?: string) => {
  if (!refreshToken) return null;

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;

  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      tokenHash: refreshToken,
      userId: payload.userId,
    },
  });

  if (!tokenRecord) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) return null;

  return generateAccessToken({
    userId: user.id,
    role: user.role as "buyer" | "seller",
  });
};