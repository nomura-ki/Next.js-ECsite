import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    await prisma.session.deleteMany({
      where: {
        token,
      },
    });

    const res = successResponse("logout success");

    res.cookies.delete("token");
    return res;
  } catch (error) {
    console.error(error);
    return errorResponse("サーバーエラー");
  }
}
