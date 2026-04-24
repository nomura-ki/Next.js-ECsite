import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    if (process.env.MOCK_DB_ERROR === "true") {
      throw new Error("Mock DB Error");
    }

    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse("Invalid credentials!", 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return errorResponse("メールアドレスまたはパスワードが正しくありません。", 401);
    }

    const load = {
      userId: user.id,
      role: user.role as "buyer" | "seller",
    };

    const accessToken = generateAccessToken(load);
    const refreshToken = generateRefreshToken({userId: user.id})

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken,
        expiresAt: expires,
      }
    })

    const res = NextResponse.json({
      message: "login success",
    });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 15,
      sameSite: "lax",
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error(error);
    return errorResponse("システムエラーが発生しました。しばらくしてから再度お試しください。");
  }
}
