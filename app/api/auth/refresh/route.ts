import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  const refreshToken = req.headers.get("cookie")
  ?.split("; ")
  .find(c => c.startsWith("refreshToken"))
  ?.split("=")[1];

  if (!refreshToken) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try { 
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new Error("JWT verify refreshToken error")
    }

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
      },
    });

    if (!tokenRecord) {
      return NextResponse.json({ message: "Invalid" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken(
      {
        userId: user.id,
        role: user.role as "buyer" | "seller",
      }
    );

    const res = NextResponse.json({ ok: true });

    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 15,
      sameSite: "lax",
    });

    return res;
  } catch (err: any) {
    console.error("refreshToken error: ", err);
    return NextResponse.json({ message: "Invalid" }, { status: 401 });
  }
}