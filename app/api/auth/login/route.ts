import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";
import { errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse("Invalid credentials", 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return errorResponse("Invalid credentials", 401);

    // TODO: tokenを生成する

    // TODO: セッションを作成してDBへ登録する

    // TODO: クッキーにtokenをセットしてレスポンスを返す

    return;
  } catch (error) {
    console.error(error);
    return errorResponse("Internal server error");
  }
}
