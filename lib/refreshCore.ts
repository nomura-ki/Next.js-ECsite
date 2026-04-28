import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/lib/auth";

export async function refreshCore(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) throw new Error("invalid refresh token");

  const tokenRecord = await prisma.refreshToken.findFirst({
    where: { tokenHash: refreshToken },
  });

  if (!tokenRecord) throw new Error("token not found");


  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new Error("Invalid credentials!");

  const newAccessToken = generateAccessToken({
    userId: tokenRecord.userId,
    role: user.role as "buyer" | "seller",
  });

  const newRefreshToken = generateRefreshToken({
    userId: tokenRecord.userId,
  });

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { tokenHash: newRefreshToken },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}