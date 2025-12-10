import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";
import { errorResponse } from "@/lib/response";
// import { json } from "node:stream/consumers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse("Invalid credentials!", 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`inputPassword: ${password}, typeof: ${typeof password}`);
      console.log(
        `correctPassword: ${user.password}, typeof: ${typeof user.password}`
      );
      return errorResponse("Invalid credentials!", 401);
    }

    // TODO: tokenを生成する
    const load = {
      userId: user.id,
      role: user.role as "buyer" | "seller",
    };

    const token = generateToken(load);

    // TODO: セッションを作成してDBへ登録する
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const newSession = await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: expires,
      },
    });

    // TODO: クッキーにtokenをセットしてレスポンスを返す
    const res = NextResponse.json({
      message: "login success",
    });

    res.cookies.set("token", newSession.token);

    return res;
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error");
  }
}
