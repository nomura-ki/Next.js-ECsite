import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    // TODO: クッキーとDBからtokenを削除する
    const token = req.cookies.get("token")?.value;

    //dbからの削除
    await prisma.session.deleteMany({
      where: {
        token,
      },
    });

    //成功レスポンス生成
    const res = successResponse("logout success");

    // cookiesからの削除
    res.cookies.delete("token");
    return res;
  } catch (error) {
    console.error(error);
    return errorResponse("サーバーエラー");
  }
}
