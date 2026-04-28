import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value

    console.log("user token", token);

    if (!token) {
      return NextResponse.json(null, {status: 401});
    }

    const payload = verifyAccessToken(token);

    if (!payload?.userId) {
      return NextResponse.json(
        {error: "unauthorized"},
        {status: 401}
      );
    }

    const user = await prisma.user.findUnique({
      where: {id: payload.userId},
      select: {
        id: true,
        role: true,
      }
    })

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "システムエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 401 }
    );
  }
}